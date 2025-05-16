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

/**
 * Represents an error with an associated HTTP status code and optional HTML flag.
 * Extends the standard `Error` class to include additional properties for status and HTML response handling.
 *
 * @property status - The HTTP status code associated with the error.
 * @property html - Indicates whether the error message is intended to be rendered as HTML.
 * @extends Error
 */
class StatusError extends Error {
    status: number;
    html: boolean;

    /**
     * Creates a new `StatusError` instance.
     *
     * @param {number | undefined} status - The HTTP status code for the error. Defaults to 500 if not provided.
     * @param {string | undefined} message - The error message. Defaults to "An unknown error occurred." if not provided.
     * @param {boolean | undefined} html - Whether the error message should be treated as HTML. Defaults to `false`.
     */
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
