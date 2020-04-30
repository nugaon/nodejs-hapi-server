import { ApiRoutes } from "../../application/api/ApiRoutes";
/**
 * Registry for routes in the system.
 * All components need to be registered in order to work.
 * This static linking method is required because of the Webpack build.
 */

export class RouteRegistry {

    /**
     * List of routes of the system.
     * Please keep this list updated.
     */
    private static readonly elements: any[] = [
      ApiRoutes,
    ];

    /**
     * Returns components.
     */
    public static getRoutes(): any[] {
        return RouteRegistry.elements;
    }

}
