export class IdentifierNotFoundError extends Error {
    constructor() {
        super("The identifier is not valid.");
    }
}
