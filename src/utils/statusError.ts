const errorNames = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Page Not Found",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
};

class StatusError extends Error {
    status: number;
    html: boolean;

    constructor(status?: number, message?: string, html?: boolean) {
        message ??= "An unknown error occurred.";
        status ??= 500;

        super(message);

        this.message = message;
        this.status = status;
        this.html = html ?? false;

        if (Object.keys(errorNames).includes(status.toString())) {
            this.name = errorNames[status as keyof typeof errorNames];
        } else {
            this.name = "Unknown Error";
        }
    }
}

export default StatusError;
