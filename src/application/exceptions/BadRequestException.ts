import * as Boom from "boom";
import { Errors } from "../generic/Errors";

export class BadRequestException extends Boom {

    constructor(msg: Errors | string) {
        super(Boom.badRequest(msg));
    }

}
