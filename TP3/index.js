require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { json } = require('body-parser');
const { addResolversToSchema } = require('@graphql-tools/schema');
const taskSchemaPromise = require('./taskSchema');
const taskResolver = require('./taskResolver');

const app = express();

async function setupServer() {
    try {
        const taskSchema = await taskSchemaPromise;
        const schemaWithResolvers = addResolversToSchema({
            schema: taskSchema,
            resolvers: taskResolver,
        });

        const server = new ApolloServer({
            schema: schemaWithResolvers,
        });

        await server.start();
        app.use(
            '/graphql',
            json(),
            expressMiddleware(server)
        );

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (error) {
        console.error('Failed to start the Apollo server:', error);
    }
}

setupServer();
