async function send(url: string, data: FormData) {
    const obj: Record<string, FormDataEntryValue> = {};
    data.forEach((value, key) => {
        obj[key] = value;
    });

    await fetch(url, {
        headers: {
            "Content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(obj),
    });
}

function formSend(url: string, formElem: HTMLFormElement) {
    formElem.addEventListener("submit", (event: SubmitEvent) => {
        event.preventDefault();

        const data = new FormData(formElem);
        void send(url, data);
    });
}

export default formSend;
