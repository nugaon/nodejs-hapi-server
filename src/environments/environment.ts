import { AppConfiguration } from "../engine/interfaces/AppConfiguration";

export const environment: AppConfiguration = {

    /**
     * Sets the hostname or IP address the server will listen on.
     * Use '0.0.0.0' to listen on all available network interfaces
     */
    host: `0.0.0.0`,

    /**
     * The TCP port the server will listen to.
     */
    port: `3000`,

    // redis: {
    //     host: "redis",
    //     port: 6379
    // },

    // database: {
    //     type: `mysql`,
    //     host: "database",
    //     port: 3306,
    //     database: `nodejs-hapi`,
    //     username: `root`,
    //     password: `nodejs-hapi-testpass`,
    //     synchronize: !process.env.PORT,
    //     dropSchema: !process.env.PORT,
    //     logging: ["warn", "error"],
    //     cache: false
    // },

    // bcryptRounds: 12
};
