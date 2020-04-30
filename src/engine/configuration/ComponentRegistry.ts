import { Logger } from "../components/Logger";
// import { Database } from "../components/Database";
// import { UserSessionRedisDb } from "../components/UserSessionRedisDb";
/**
 * Registry for components in the system.
 * All components need to be registered in order to work.
 * This static linking method is required because of the Webpack build.
 */

export class ComponentRegistry {

    /**
     * List of components of the system.
     * Please keep this list updated.
     */
    private static readonly elements: any[] = [
        Logger
    ];

    /**
     * Returns components.
     */
    public static getComponents(): any[] {
        return ComponentRegistry.elements;
    }

}
