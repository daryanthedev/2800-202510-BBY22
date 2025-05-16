import { Db, ObjectId, WithId } from "mongodb";
import { Request } from "express";
import { isUsersSchema, ChallengeStatus } from "../schema.js";

/**
 * Offset for Pacific Standard Time (PST) in milliseconds (UTC-8).
 */
const PST_OFFSET = -8 * 60 * 60 * 1000; // UTC-8 in milliseconds

/**
 * The number of daily challenges to maintain in the database.
 */
const NUM_CHALLENGES = 3;

/**
 * Interface for the challenge information.
 */
interface ChallengeInfo {
    /** The name of the challenge. */
    name: string;
    /** The description of the challenge. */
    description: string;
    /** The number of points awarded for completing the challenge. */
    pointReward: number;
    /** The end time of the challenge. */
    endTime: Date;
}

/**
 * Interface for the user's challenge information, extending ChallengeInfo.
 */
interface UserChallengeInfo extends ChallengeInfo {
    /** Whether the user has completed the challenge. */
    completed: boolean;
}

/**
 * Gets the current time in Pacific Standard Time (PST).
 * @returns {Date} The current date and time in PST.
 */
function getPstTimeNow(): Date {
    return new Date(Date.now() + PST_OFFSET);
}

/**
 * Deletes a challenge from the database by its ObjectId.
 * @param {Db} database - The MongoDB database instance.
 * @param {ObjectId} challengeId - The ObjectId of the challenge to delete.
 * @throws Will throw an error if the challenge is not found.
 */
async function deleteChallenge(database: Db, challengeId: ObjectId): Promise<void> {
    const result = await database.collection("challenges").deleteOne({ _id: challengeId });
    if (result.deletedCount === 0) {
        throw new Error("Challenge not found");
    }
}

/**
 * Creates a specified number of new challenges and inserts them into the database.
 * @param {Db} database - The MongoDB database instance.
 * @param {number} amount - The number of challenges to create.
 * @returns {Promise<WithId<ChallengeInfo>[]>} The created challenges with their generated ObjectIds.
 */
async function createChallenges(database: Db, amount: number): Promise<WithId<ChallengeInfo>[]> {
    const pstTimeNow = getPstTimeNow();
    // Calculate the start of tomorrow in PST
    const startOfTomorrowPst = new Date(
        Date.UTC(pstTimeNow.getUTCFullYear(), pstTimeNow.getUTCMonth(), pstTimeNow.getUTCDate() + 1, 0, 0, 0, 0),
    );

    const challenges: ChallengeInfo[] = [];
    for (let i = 0; i < amount; i++) {
        challenges[i] = {
            name: "Challenge 1",
            description: "Complete the first challenge.",
            pointReward: Math.floor(Math.random() * 90) + 10, // Random reward between 10 and 99
            endTime: startOfTomorrowPst,
        };
    }

    const insertResult = await database.collection("challenges").insertMany(challenges);
    // Attach the generated _id to each challenge
    const insertedIds = Object.values(insertResult.insertedIds);
    const challengesWithIds = challenges.map((challenge, idx) => ({
        ...challenge,
        _id: insertedIds[idx],
    }));
    return challengesWithIds;
}

/**
 * Retrieves all valid daily challenges from the database, removes expired or invalid ones, and creates new ones if needed.
 * @param {Db} database - The MongoDB database instance.
 * @returns {Promise<WithId<ChallengeInfo>[]>} The info about all of the current challenges.
 */
async function getAllChallenges(database: Db): Promise<WithId<ChallengeInfo>[]> {
    const challenges = await database.collection("challenges").find().toArray();

    // Validate and filter challenges, deleting any that are invalid
    const challengeInfos: WithId<ChallengeInfo>[] = challenges
        .map(challenge => {
            if (
                !("name" in challenge) ||
                !("description" in challenge) ||
                !("pointReward" in challenge) ||
                !("endTime" in challenge) ||
                typeof challenge.name !== "string" ||
                typeof challenge.description !== "string" ||
                typeof challenge.pointReward !== "number" ||
                !(challenge.endTime instanceof Date)
            ) {
                void deleteChallenge(database, challenge._id);
                return null;
            }
            return {
                _id: challenge._id,
                name: challenge.name,
                description: challenge.description,
                pointReward: challenge.pointReward,
                endTime: challenge.endTime,
            };
        })
        .filter(challengeInfo => challengeInfo !== null);

    // Remove challenges that have expired
    const remainingChallengeInfos = challengeInfos.filter(challengeInfo => {
        // If the endTime has been passed, delete the challenge
        if (challengeInfo.endTime.getTime() < getPstTimeNow().getTime()) {
            void deleteChallenge(database, challengeInfo._id);
            return false;
        }
        return true;
    });

    // If there are less than NUM_CHALLENGES challenges, create new ones
    let newChallenges: WithId<ChallengeInfo>[] = [];
    if (remainingChallengeInfos.length < NUM_CHALLENGES) {
        newChallenges = await createChallenges(database, NUM_CHALLENGES - remainingChallengeInfos.length);
    }

    return remainingChallengeInfos.concat(newChallenges);
}

/**
 * Updates the user's challenge completion statuses to match the current set of challenges.
 * Removes statuses for challenges that no longer exist and adds statuses for new challenges.
 * @param {Db} database - The MongoDB database instance.
 * @param {string} userId - The user's ObjectId as a string.
 * @param {ChallengeStatus[]} challengeStatuses - The user's current challenge statuses.
 * @param {WithId<ChallengeInfo>[]} challenges - The current set of challenges.
 * @returns {Promise<ChallengeStatus[]>} The updated challenge statuses.
 */
async function updateUserChallengeStatuses(
    database: Db,
    userId: string,
    challengeStatuses: ChallengeStatus[],
    challenges: WithId<ChallengeInfo>[],
): Promise<ChallengeStatus[]> {
    let challengeStatusesModified = false;

    // Filter out any challenge completions for challenges that no longer exist
    const challengeIds = challenges.map(challenge => challenge._id.toHexString());
    challengeStatuses = challengeStatuses.filter(challengeStatus => {
        if (!challengeIds.includes(challengeStatus.challengeId)) {
            challengeStatusesModified = true;
            return false;
        }
        return true;
    });

    const newChallengeStatuses: ChallengeStatus[] = [];
    // Add any new challenges to the user's challenge completions
    const challengeStatusIds = challengeStatuses.map(challengeStatus => challengeStatus.challengeId);
    challenges.forEach(challenge => {
        if (!challengeStatusIds.includes(challenge._id.toHexString())) {
            newChallengeStatuses.push({
                challengeId: challenge._id.toHexString(),
                completed: false,
            });
            challengeStatusesModified = true;
        }
    });

    challengeStatuses = challengeStatuses.concat(newChallengeStatuses);

    // Update the user's challenge completions in the database if modified
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (challengeStatusesModified) {
        await database.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { challengeStatuses } });
    }

    return challengeStatuses;
}

/**
 * Retrieves the challenge information for the logged-in user from the database.
 * Updates the user's challenge statuses to match the current set of challenges.
 * @param {Request} req - The Express request object.
 * @param {Db} database - The MongoDB database instance.
 * @returns {Promise<UserChallengeInfo[]>} The info about all of the user's challenges.
 * @throws Will throw an error if the user is not authenticated, not found, or has invalid data.
 */
async function getUserChallenges(req: Request, database: Db): Promise<UserChallengeInfo[]> {
    if (req.session.loggedInUserId === undefined) {
        throw new Error("User must authenticate first");
    }

    const user = await database.collection("users").findOne({
        _id: new ObjectId(req.session.loggedInUserId),
    });

    // Ensure user is valid
    if (user === null) {
        throw new Error("User not found");
    }
    if (!isUsersSchema(user)) {
        throw new Error("User data is not valid");
    }

    const challenges = await getAllChallenges(database);

    // This function call will update user.challengeStatuses if necessary
    // This includes removing any completed challenges that no longer exist and adding any new challenges
    user.challengeStatuses = await updateUserChallengeStatuses(database, req.session.loggedInUserId, user.challengeStatuses, challenges);

    const userChallenges = user.challengeStatuses.map((challengeStatus, index: number): UserChallengeInfo => {
        const challenge = challenges[index];
        return {
            ...challenge,
            completed: challengeStatus.completed,
        };
    });
    return userChallenges;
}

export { getUserChallenges };
export type { ChallengeInfo };
