/*
 * Interface for the challenge information.
 */
interface ChallengeInfo {
    // The ID of the challenge.
    _id: string;
    // The name of the challenge.
    name: string;
    // The description of the challenge.
    description: string;
    // The number of points awarded for completing the challenge.
    pointReward: number;
    // The end time of the challenge.
    endTime: Date;
    // The div element of the challenge.
    div: HTMLDivElement
}

/*
 * Interface for the modal.
 */
interface Modal {
    // The modal element.
    modal: HTMLDivElement;
    // The title element of the modal.
    title: HTMLHeadingElement;
    // The description element of the modal.
    description: HTMLParagraphElement;
    // The points element of the modal.
    points: HTMLSpanElement;
    // The close button element of the modal.
    closeButton: HTMLButtonElement;
}

function showModal(modal: Modal, title: string, description: string, points: number) {
    modal.title.textContent = title.toString();
    modal.description.textContent = description.toString();
    modal.points.textContent = points.toString();
    modal.modal.classList.remove("hidden");
}

function closeModal(modal: Modal) {
    modal.modal.classList.add("hidden");
}

function initializeChallenges(challenges: ChallengeInfo[], modal: Modal): void {
    modal.closeButton.addEventListener("click", () => {
        closeModal(modal);
    });

    challenges.forEach(challenge => {
        challenge.div.addEventListener("click", () => {
            showModal(
                modal,
                challenge.name,
                challenge.description,
                challenge.pointReward,
            );
        });
    });
    console.log(challenges);
}

export default initializeChallenges;
