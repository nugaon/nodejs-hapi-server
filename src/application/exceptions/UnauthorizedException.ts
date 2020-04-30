import * as Boom from "boom";

export class UnauthorizedException extends Boom {

    constructor() {
        super(Boom.unauthorized());
    }

}
