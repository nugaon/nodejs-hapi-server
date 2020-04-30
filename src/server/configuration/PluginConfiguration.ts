import * as hapiSwagger from "hapi-swagger";
import * as Inert from "inert";
import * as Vision from "vision";
import * as hapiAuthCookie from "hapi-auth-cookie";
import pjson from "../../../package.json";

interface PluginLike {
    plugin: any;
    options?: any;
}

export class PluginConfiguration {
    public getConfiguration(): PluginLike[] {
        const plugins: PluginLike[] = [];
        if (process.env.ENV === 'production') {
            plugins.push(
                {
                    plugin: hapiAuthCookie
                },
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
                        documentationPath: "/documentation",
                        payloadType: "json",
                        grouping: "tags",
                        tagsGroupingFilter: (tag: string): boolean => !["api", "v1", "filter", "search", "list"]
                            .some((e: string) => e === tag)
                    }
                }
            );
        }
        return plugins;
    }

}
