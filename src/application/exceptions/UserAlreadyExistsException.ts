import * as Boom from "boom";

export class UserAlreadyExistsException extends Boom {

    constructor() {
        super(Boom.conflict("USER_ALREADY_EXISTS"));
    }

}
