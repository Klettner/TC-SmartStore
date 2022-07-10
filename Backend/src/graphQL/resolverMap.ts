// resolverMap.ts
import { PubSub } from 'graphql-subscriptions'
import { IResolvers } from '@graphql-tools/utils'
import { signup, login } from './resolvers/userResolver'
import {
	createPallet,
	updatePalletWeight,
	getPallet,
	getAllPallets,
	updateProductOfPallet,
	deletePallet
} from './resolvers/palletResolver'

const pubsub = new PubSub()

const resolverMap: IResolvers = {
	Query: {
		helloWorld(_: void, args: void): string {
			return `Welcome to GraphQL 🚀 🚀 🚀`
		},
		getPallet,
		getAllPallets,
	},
	Mutation: {
		// User
		signup,
		login,

		// Pallet
		createPallet,
		updatePalletWeight,
		updateProductOfPallet,
		deletePallet
	},
	Subscription: {
		palletUpdated: {
			subscribe: () => pubsub.asyncIterator(['PALLET_UPDATED'])
		}
	}
}
export default resolverMap
