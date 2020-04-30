import * as hapiSwagger from "hapi-swagger";
import { default as Inert } from "@hapi/inert";
import * as Vision from "@hapi/vision";
import * as hapiAuthCookie from "hapi-auth-cookie";
import pjson from "../../../package.json";

interface PluginLike {
    plugin: any;
    options?: any;
}

export class PluginConfiguration {
    public getConfiguration(): PluginLike[] {
        const plugins: PluginLike[] = [];
        if (process.env.ENV !== 'production') {
            plugins.push(
                // {
                //     plugin: hapiAuthCookie
                // },
                {
                    plugin: Inert
                },
                {
                    plugin: Vision
                },
                {
                    plugin: hapiSwagger,
                    options: {
                        info: {
                            title: "NodeJS Hapi API Documentation",
                            version: pjson.version,
                            contact: {
                                name: pjson.author,
                                email: pjson.email
                            }
                        },
                        basePath: "/",
                        documentationPath: "/documentation"
                    }
                }
            );
        }
        return plugins;
    }

}
