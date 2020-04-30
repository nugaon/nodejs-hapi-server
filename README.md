# Description

This repository serves as a backbone at NodeJS HTTP sever projects.
It contains auto-generated documentation, payload/parameter checking,
dependency injection and many more basic requirements.

# Run

You can use Docker to build up every service that this server uses.
To do that run `./run-dev-dockerstack.sh` in the project's root directory.
As it is in its name, it should be used only for development purposes.
If you have anything or the server doesn't have any other service dependency use

> npm run dev

command.

# Build

For production you would like to build your project, which you can do by the

> npm run build

command. Webpack is used in this process, you can read its configuration in 'webpack.config.js'

# Route registry

If you would like to add or remove routes to this server, you can do that in the
[RouteRegistry](src/server/configuration/RouteRegistry.ts).
The definitions of the routes which are imported in the * * RouteRegistry * *
should be placed in the [application directory](src/application).

# Security

For the HTTP server security you must check and adjust
[ApplicationServerOptions](src/server/configuration/ApplicationServerOptions.ts).

# Commented Code Blocks

The codebase contains code blocks which are commented out for later usage like
 * [Database](src/engine/components/Database.ts)
 * [UserSessionRedisDb](src/engine/components/UserSessionRedisDb.ts)
and its calling statements.

# Process environment usage

The application uses the following environment variables:
 * ENV # has to be 'production' or 'development'
  
