import { injectable } from "inversify";
import { RedisClient } from "redis";
import { promisify } from "util";
import { Resolution } from "../../application/generic/Resolution";
import { OnDestroy, OnInit } from "../interfaces/EngineLifeCycleEvents";
import { Logger } from "./Logger";

@injectable()
export class UserSessionRedisDb implements OnDestroy, OnInit {

    private redisClient: RedisClient;
    private redisDatabase: number;
    private redisHost: string;
    private redisPort: number;
    public smembers: Function;
    public getValue: Function;

    constructor(
        private logger: Logger
    ) {

        //init values from app environment
        this.initEnv();

        this.redisClient = new RedisClient({
            host: this.redisHost,
            port: this.redisPort
        });

        this.smembers = promisify(this.redisClient.smembers).bind(this.redisClient);
        this.getValue = promisify(this.redisClient.get).bind(this.redisClient);

        this.redisDatabase = 2;

        this.redisClient.select(this.redisDatabase); //select redis db for the user http sessions
    }

    public async onInit(): Promise<void> {
        this.logger.info(this.constructor.name + `For user sessions connects to Redis to ${this.redisHost}:${this.redisPort}, database: ${this.redisDatabase}`);
    }

    public async onDestroy(): Promise<void> {
        this.logger.warn(this.constructor.name + "Redis user session database will be wiped due to the termination of the application");

        if (this.redisClient) {
            this.redisClient.flushdb();
        }
    }

    private initEnv(): void {
        // this.redisHost = environment.redis.host;
        // this.redisPort = environment.redis.port;
    }

    public async setValueWithPublish(eventAndKeyName: string, value: string): Promise<Array<string>> {
        return new Promise((resolve: Resolution<Array<string>>): void => {
            this.redisClient.multi([
                ["set", eventAndKeyName, value],
                ["publish", eventAndKeyName, value]
            ]).exec((err: Error | null, resp: Array<string>) => {
                resolve(resp);
            });
        });
    }

    public async multi(redisCommands: Array<Array<(string | number)>>): Promise<Array<string>> {
        return new Promise((resolve: Resolution<Array<string>>): void => {
            this.redisClient.multi(redisCommands).exec((err: Error | null, replies: Array<string>) => {
                resolve(replies);
            });
        });
    }

    /**
     * refresh grouped JSON value
     * @param sessionId formula {groupId}-{groupValueId} (the user's session contains in property name userSessionId)
     * @param value JSON data that you want to save (e.g. session credentials)
     */
    public refreshGroupedJsonValue(key: string, value: object): boolean {
        return this.redisClient.set(key, JSON.stringify(value));
    }

    /**
     * set JSON value into a Redis set. The value could retrieve by {groupId}-{groupValueId}
     * @param groupId the identification of the value's group (e.g. userId)
     * @param groupValueId the identification of the value in the group. (e.g. generated sessionId for the user)
     * @param value JSON data that you want to save (e.g. session credentials)
     */
    public async setGroupedJsonValue(
        groupId: string | number,
        groupValueId: string | number,
        value: object
    ): Promise<Array<string>> {
        return this.multi([
            ["sadd", `group-${groupId}`, `${groupValueId}`],
            ["set", `${groupId}-${groupValueId}`, JSON.stringify(value)]
        ]);
    }

    /**
     * get grouped JSON value
     * @param valueId the identification of the value. formula: {groupId}-{groupValueId}
     */
    public async getGroupedJsonValue<T>(valueId: string): Promise<T> {
        const rawValue: string = await this.getValue(valueId);

        return JSON.parse(rawValue);
    }

    /**
     * delete grouped JSON value
     * @param valueId the identification of the value. formula: {groupId}-{groupValueId}
     */
    public async deleteGroupedJsonValue(valueId: string): Promise<Array<string>> {
        const idArray: Array<string> = valueId.split("-");

        return this.multi([
            ["srem", `group-${idArray[0]}`, idArray[1]],
            ["del", valueId]
        ]);
    }

    /**
     * delete group and its values
     * @param groupId the identification of the value's group (e.g. userId)
     */
    public async deleteGroupArray(groupId: string): Promise<Array<string>> {
        const valueIds: Array<string> = await this.smembers(`group-${groupId}`);

        const deleteGroupQueries: Array<Array<string>> = [];
        //delete values under valueIds in the group
        valueIds.forEach((valueId: string) => {
            deleteGroupQueries.push(
                ["del", `${groupId}-${valueId}`]
            );
        });

        //delete group
        deleteGroupQueries.push(
            ["del", `group-${groupId}`]
        );

        return this.multi(deleteGroupQueries);
    }
}
