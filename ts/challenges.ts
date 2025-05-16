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

/**
 * Creates a modal for displaying challenge information.
 * @param {string} name The title of the challenge.
 * @param {string} description The description of the challenge.
 * @param {number} points The number of points awarded for completing the challenge.
 * @returns {Modal} The modal elements.
 */
function createModal(name: string, description: string, points: number): Modal {
    const modalElem = document.createElement("div");
    modalElem.className = "fixed inset-0 bg-opacity-50 flex items-center justify-center z-100 backdrop-blur-sm";

    const modalContent = document.createElement("div");
    modalContent.className = "bg-[var(--color-quietquest-gold)] text-[var(--color-quietquest-dark)] p-6 rounded-xl w-96 shadow-lg space-y-4 backdrop-filter-none";
    modalElem.appendChild(modalContent);

    const nameElem = document.createElement("h2");
    nameElem.className = "text-xl font-semibold";
    nameElem.textContent = name.toString();
    modalContent.appendChild(nameElem);

    const descriptionElem = document.createElement("p");
    descriptionElem.textContent = description.toString();
    modalContent.appendChild(descriptionElem);

    const pointsElem = document.createElement("p");
    modalContent.appendChild(pointsElem);

    const pointsStrong = document.createElement("strong");
    pointsStrong.textContent = "Points:";
    pointsElem.appendChild(pointsStrong);

    const pointsSpan = document.createElement("span");
    pointsSpan.textContent = points.toString();
    pointsElem.appendChild(pointsSpan);

    const closeButton = document.createElement("button");
    closeButton.className = "mt-4 px-4 py-2 bg-[var(--color-quietquest-cream)] text-quietquest-dark cursor-pointer rounded shadow";
    closeButton.textContent = "Close";
    modalContent.appendChild(closeButton);

    return {
        modal: modalElem,
        title: nameElem,
        description: descriptionElem,
        points: pointsElem,
        closeButton,
    };;
}

function initializeChallenges(challenges: ChallengeInfo[], modalContainer: HTMLElement): void {
    challenges.forEach(challenge => {
        challenge.div.addEventListener("click", () => {
            const modal = createModal(
                challenge.name,
                challenge.description,
                challenge.pointReward,
            );
            // Append the modal to the modal container
            modalContainer.appendChild(modal.modal);
            // Close the modal when the close button is clicked
            modal.closeButton.addEventListener("click", () => {
                modalContainer.removeChild(modal.modal);
            });
            // Allow clicking outside the modal to close it
            modal.modal.addEventListener("click", event => {
                if (event.target === modal.modal) {
                    modalContainer.removeChild(modal.modal);
                }
            });
        });
    });
}

export default initializeChallenges;
