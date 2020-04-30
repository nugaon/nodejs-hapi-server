import { injectable } from "inversify";
import { default as Joi } from "@hapi/joi";

@injectable()
export class ApiValidator {

    constructor() {}

    public getSmth() {
        return {
            payload: Joi.object({
              id: Joi.number().description('smth')
            })
        };
    }
}
