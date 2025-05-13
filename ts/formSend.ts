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

function formSend(url: string, formElem: HTMLFormElement, redirectPath: string | undefined) {
    formElem.addEventListener("submit", (event: SubmitEvent) => {
        event.preventDefault();

        const data = new FormData(formElem);
        void send(url, data, redirectPath);
    });
}

export default formSend;
