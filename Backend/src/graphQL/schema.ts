// schema.ts
import 'graphql-import-node'
import { makeExecutableSchema } from '@graphql-tools/schema'
import resolvers from './resolverMap'
import { GraphQLSchema } from 'graphql'
// Graphql schemas
import * as typeDefs from './schema/schema.graphql'
import * as userTypeDefs from './schema/userSchema.graphql'
import * as palletTypeDefs from './schema/palletSchema.graphql'

const schema: GraphQLSchema = makeExecutableSchema({
	typeDefs: [
		typeDefs,
		userTypeDefs,
		palletTypeDefs
	],
	resolvers
})
export default schema