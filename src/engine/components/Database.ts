import { injectable } from "inversify";
import { Connection, ConnectionOptions, createConnection } from "typeorm";
import { EntityRegistry } from "../../server/configuration/EntityRegistry";
import { Rejection, Resolution } from "../../application/generic/Resolution";
import { environment } from "../../environments/environment";
import { OnDestroy, OnInit } from "../interfaces/EngineLifeCycleEvents";
import { Logger } from "./Logger";

@injectable()
export class Database implements OnDestroy, OnInit {

    private connection: Connection;

    constructor(
        private logger: Logger,
    ) { }

    public async onInit(): Promise<void> {
        // await this.connect();
    }

    public async onDestroy(): Promise<void> {
        this.logger.warn(this.constructor.name + ": Database connection closed due to the termination of the application");
        if (this.connection) {
            return this.connection.close();
        }
    }

    // private async connect(): Promise<void> {
    //     return new Promise<void>((resolve: Resolution<void>, reject: Rejection): void => {
    //         let connectionOptions: ConnectionOptions = environment.database;
    //         connectionOptions = { ...connectionOptions, entities: EntityRegistry.getEntities() };
    //         createConnection(connectionOptions)
    //         .then((connection: Connection) => {
    //             this.connection = connection;
    //             this.logger.info(this.constructor.name + `: Database connection is established with ${connectionOptions.database}`);
    //             resolve();
    //         })
    //         .catch((error: Error) => {
    //             this.logger.error(this.constructor.name + ": Error while connecting to the database (details bellow)...");
    //             reject(error);
    //         });
    //     });
    // }
}
