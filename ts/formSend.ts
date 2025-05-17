/**
 * Sends form data to the specified URL using POST and handles redirect or reload.
 * @param {string} url - The endpoint to send data to.
 * @param {FormData} data - The form data to send.
 * @param {string | undefined} redirectPath - The path to redirect to on success, or reload if undefined.
 */
async function send(url: string, data: FormData, redirectPath: string | undefined) {
    const obj: Record<string, FormDataEntryValue> = {};
    data.forEach((value, key) => {
        obj[key] = value;
    });

    const response = await fetch(url, {
        headers: {
            "Content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(obj),
    });
    if (response.ok) {
        if (redirectPath !== undefined) {
            location.assign(redirectPath);
        } else {
            location.reload();
        }
    }
}

/**
 * Attaches a submit handler to a form that sends data via AJAX and handles redirect/reload.
 * @param {string} url - The endpoint to send data to.
 * @param {HTMLFormElement} formElem - The form element to attach the handler to.
 * @param {string | undefined} redirectPath - The path to redirect to on success, or reload if undefined.
 */
function formSend(url: string, formElem: HTMLFormElement, redirectPath: string | undefined) {
    formElem.addEventListener("submit", (event: SubmitEvent) => {
        event.preventDefault();

        const data = new FormData(formElem);
        void send(url, data, redirectPath);
    });
}

export default formSend;
