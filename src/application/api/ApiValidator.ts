import { injectable } from "inversify";
import * as Joi from "joi";

@injectable()
export class ApiValidator {

    constructor() {}

    public getSmth() {
        return {
            payload: Joi.object()
        };
    }
}
