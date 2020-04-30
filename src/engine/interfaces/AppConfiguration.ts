import { ConnectionOptions } from "typeorm";

export interface AppConfiguration {
    /**
     * Sets the hostname or IP address the server will listen on.
     * Use '0.0.0.0' to listen on all available network interfaces
     */
    host: string;

    /**
     * The TCP port the server will listen to.
     */
    port: string;

     // session: {
     //     password: string;
     // };

     // redis: {
     //     host: string;
     //     port: number;
     // };

     // database: ConnectionOptions;

     /**
     * BCrypt rounds.
     */
    // bcryptRounds: number;
}
