import { Container, interfaces } from "inversify";
import { Logger } from "./engine/components/Logger";
import { ShutDownEventHandler } from "./engine/lifecycle/ShutDownEventHandler";
import { ShutDownEventInterceptor } from "./engine/lifecycle/ShutDownEventInterceptor";
import { ComponentLoader } from "./engine/loaders/ComponentLoader";
import { Server } from "./server/Server";

export class Engine {

    private container: Container;

    public async bootstrapApplication(withServer: boolean): Promise<void> {
        console.log("[Engine] Initializing application engine...");
        try {
            this.initContainer({
                defaultScope: "Singleton",
                skipBaseClassChecks: true,
                autoBindInjectable: true
            });
            this.initAppContextBinding();
            this.attachGracefulShutdownEvents();
            await this.loadComponents();
            if (withServer) {
                await this.startServer();
            }
        } catch (e) {
            console.error("[Engine] Error while initializing application engine. Application is shutting down.");
            console.error(e);
            process.exit(1);
        }
    }

    private initContainer(config: interfaces.ContainerOptions): void {
        this.container = new Container(config);
        this.container.applyMiddleware(ShutDownEventInterceptor);
    }

    private initAppContextBinding(): void {
        this.container.bind<Container>("ctx").toConstantValue(this.container);
    }

    private attachGracefulShutdownEvents(): void {
        ShutDownEventHandler.getInstance()
            .attachShutdownEvent(this.container.get(Logger));
    }

    private async loadComponents(): Promise<void> {
        await new ComponentLoader(this.container).loadComponents();
    }

    private async startServer(): Promise<void> {
        await this.container.get<Server>(Server).init();
    }

    public getContainer(): Container {
        return this.container;
    }

}
