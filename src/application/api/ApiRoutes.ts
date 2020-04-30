import { ServerRoute } from "hapi";
import { injectable } from "inversify";
import { Routes } from "../generic/Routes";
import { ApiController } from "./ApiController";
import { ApiValidator } from "./ApiValidator";

@injectable()
export class ApiRoutes implements Routes {

    constructor(
        private controller: ApiController,
        private validator: ApiValidator
    ) { }

    public readonly routes: ServerRoute<Array<any>> = [
        {
            method: "POST",
            path: "/api/v1/smth",
            options: {
                description: "hapi route test",
                tags: ["api", "v1", "smth"],
                validate: this.validator.getSmth(),
                handler: async (request: any) => {
                    return this.controller.getSmth(request);
                }
            }
        }
    ];
}
