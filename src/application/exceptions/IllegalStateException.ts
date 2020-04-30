import * as Boom from "boom";

export class IllegalStateException extends Boom {

    constructor() {
        super(Boom.internal());
    }

}
