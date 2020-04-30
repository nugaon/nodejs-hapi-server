import { injectable } from "inversify";
import { ApiService } from "./ApiService";


@injectable()
export class ApiController {

    constructor(private service: ApiService) {
    }

    public async getSmth(request: any) {
        //return this.service.getSmth(request.payload);
    }
}
