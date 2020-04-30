import * as Hapi from "hapi";
import { injectable } from "inversify";
import { Logger } from "../engine/components/Logger";
import { OnDestroy } from "../engine/interfaces/EngineLifeCycleEvents";
import { environment } from "../environments/environment";
import { ApplicationServerOptions } from "./configuration/ApplicationServerOptions";
import { ErrorConfiguration } from "./configuration/ErrorConfiguration";
import { PluginConfiguration } from "./configuration/PluginConfiguration";
import { RouteLoader } from "./configuration/RouteLoader";
import { getRepository } from "typeorm";
// import { UserSessionRedisDb } from "../engine/components/UserSessionRedisDb";
import pjson from "../../package.json"

@injectable()
export class Server implements OnDestroy {

    public httpServer: Hapi.Server;

    constructor(
        private logger: Logger,
        private routeLoader: RouteLoader,
        // private sessionCache: UserSessionRedisDb,
    ) {
        ErrorConfiguration();

    }exitHook

    public async init(): Promise<void> {
        this.logger.info("=======[SERVER START]=======");
        this.logger.info(`Initializing ${pjson.name} server on ${environment.host}:${environment.port}`);

        this.httpServer = new Hapi.Server(this.getServerOptions());

        await this.httpServer.register(this.getPluginConfiguration());

        const routes: any = this.routeLoader.loadModules();

        this.httpServer.route([].concat.apply([], routes));
        this.start();
    }

    private getServerOptions(): Hapi.ServerOptions {
        return new ApplicationServerOptions().getOptions(this.logger);
    }

    private getPluginConfiguration(): Array<{ plugin: any; options?: any }> {
        return new PluginConfiguration().getConfiguration();
    }

    private setAuthStrategy() {
      this.httpServer.auth.strategy("session", "cookie", {
      //     password: environment.session.password,
      //     ttl: 1000 * 60 * 60 * 24 * 28, // 28 days
      //     keepAlive: false,
      //     isSecure: process.env.ENV === 'production',
      //     validateFunc: async (request: ValidationRequest, session: ValidationSession): Promise<ValidationResult> => {
      //         const cached: CachedUser = await this.sessionCache
      //             .getGroupedJsonValue<CachedUser>(session.userSessionId);
      //         if (!cached) {
      //             return {
      //                 valid: false
      //             };
      //         }
      //         if (cached.id !== session.id) {
      //             return {
      //                 valid: false
      //             };
      //         }
      //         const credentials: Credentials = {
      //             id: cached.id,
      //             io: request.state.io
      //         };
      //         const result: ValidationResult = {
      //             valid: true,
      //             credentials
      //         };
      //         if (cached.io !== request.state.io && request.state.io) {
      //             this.sessionCache.refreshGroupedJsonValue(
      //                 session.userSessionId,
      //                 credentials
      //             );
      //             // await this.websocketService.setUserSocketId(
      //             //     session.id,
      //             //     session.userSessionId,
      //             //     request.state.io
      //             // );
      //             await getRepository(User)
      //             .update(cached.id, {
      //                 lastLoggedIn: new Date()
      //             });
      //         }
      //         return result;
      //     }
      });
    }

    private start(): void {
        (async (server: Server): Promise<void> => {
            try {
                await server.httpServer.start();
            } catch (e) {
                console.error(e);
                process.exit(1);
            }
        })(this);
        this.logger.info(`${pjson.name} ${pjson.version} is listening on ${this.httpServer.info.uri}`);
    }

    public async onDestroy(): Promise<void> {
        this.logger.warn(`${pjson.name} ${pjson.version} server is stopping`);
        return this.httpServer.stop({ timeout: 10000 });
    }

}

interface ValidationRequest {
    state: {
        io: string | undefined;
    };
}

interface ValidationSession {
    id: number;
    userSessionId: string;
}

interface CachedUser {
    id: number;
    io: string | undefined;
}

interface Credentials {
    io: string | undefined;
    id: number;
}

interface ValidationResult {
    valid: boolean;
    credentials?: Credentials;
}
