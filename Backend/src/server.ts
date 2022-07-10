import dotenv from "dotenv"
import mongoose from "mongoose"

// GraphQL imports
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import express from 'express'
import { createServer } from 'http'
import depthLimit from 'graphql-depth-limit'
import schema from './graphQL/schema'
// GraphQl pubsub
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'

import getUserId from './security/tokenPayload'
import { GraphQLSchema } from "graphql"


// initialize configuration
dotenv.config()

// port is now available to the Node.js runtime
// as if it were an environment variable
const port = process.env.PORT || process.env.SERVER_PORT
const { DB_USER, DB_PASS } = process.env
const NODE_ENV = process.env.NODE_ENV
const corsOptions = {
	origin: ["http://localhost:3000", "https://studio.apollographql.com", "https://tc-smart-store.herokuapp.com"],
	credentials: true
}

// set up the mongoDB connection (use cloud as default)
export let dbUrl = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.s17vs.mongodb.net/SmartStore?retryWrites=true&w=majority`

mongoose
	.connect(dbUrl)
	.then(() => {
		// tslint:disable-next-line:no-console
		console.log('\n🚀 	Connected to SmartStore DB\n')
	})
	.catch((err) => {
		// tslint:disable-next-line:no-console
		console.log('\n🚫 	ERROR: ', err.message, "\n")
	})

// Apollo GraphQl Server
async function startApolloServer(graphqlSchema: GraphQLSchema) {
	const app = express()
	const httpServer = createServer(app)

	const wsServer = new WebSocketServer({
		server: httpServer,
		path: "/graphql"
	})
	const serverCleanup = useServer({ schema }, wsServer)

	const server = new ApolloServer({
		schema: graphqlSchema,
		validationRules: [depthLimit(7)],
		csrfPrevention: true,
		cache: 'bounded',
		context: ({ req }) => {
			return {
				...req,
				userId:
					req && req.headers.authorization
						? getUserId(req)
						: null
			}
		},
		plugins: [
			ApolloServerPluginDrainHttpServer({ httpServer }),
			{
				async serverWillStart() {
					return {
						async drainServer() {
							await serverCleanup.dispose()
						},
					}
				},
			},
		],
	})

	await server.start()
	server.applyMiddleware({
		app,
		cors: corsOptions,
		path: "/graphql"
	})

	await new Promise<void>(resolve => httpServer.listen(port, () => {
		// tslint:disable-next-line:no-console
		console.log(
			`\n🚀 Query endpoint ready at http://localhost:${port}${server.graphqlPath}`
		)
		// tslint:disable-next-line:no-console
		console.log(
			`\n🚀 Subscription endpoint ready at ws://localhost:${port}${server.graphqlPath}`
		)
	}))
}

startApolloServer(schema)
