import { PubSub } from "graphql-subscriptions"
import { Logger } from "tslog"

import { Pallet } from "../../models/palette"

const log = new Logger({ name: "Pallet Resolver" })
const pubsub = new PubSub()

async function createPallet(_: void, args: any, context: any) {
	try {
		checkAuthentication(context)

		const newPallet = new Pallet({
			serialNumber: args.pallet.serialNumber,
			weight: args.pallet.weight,
			product: {
				title: "",
				weight: 0
			}
		})

		return await newPallet.save()
	} catch (error) {
		log.error(error)
		throw error
	}
}

async function updatePalletWeight(_: void, args: any, context: any) {
	try {
		checkAuthentication(context)

		const update = {
			"weight": args.weight
		}
		const filter = {
			"serialNumber": args.serialNumber
		}
		const updatedPallet = await Pallet.findOneAndUpdate(filter, update, { "runValidators": true })
		pubsub.publish("PALLET_UPDATED", { palletUpdated: updatedPallet })
		return updatedPallet
	} catch (error) {
		log.error(error)
		throw error
	}
}

async function updateProductOfPallet(_: void, args: any, context: any) {
	try {
		checkAuthentication(context)

		const update = {
			"product": {
				"title": args.product.title,
				"weight": args.product.weight
			}
		}
		const filter = {
			"serialNumber": args.serialNumber
		}
		const updatedPallet = await Pallet.findOneAndUpdate(filter, update, {
			"runValidators": true, "new": true
		})
		log.debug(`Updated pallet: ${updatedPallet}`)
		return updatedPallet
	} catch (error) {
		log.error(error)
		throw error
	}
}

async function deletePallet(_: void, args: any, context: any) {
	try {
		checkAuthentication(context)

		const filter = {
			"serialNumber": args.serialNumber
		}
		const deletedPallet = await Pallet.findOneAndDelete(filter)
		return deletedPallet
	} catch (error) {
		log.error(error)
		throw error
	}
}

async function getPallet(_: void, args: any, context: any) {
	try {
		checkAuthentication(context)

		const filter = {
			"serialNumber": args.serialNumber
		}
		return await Pallet.findOne(filter)
	} catch (error) {
		log.error(error)
		throw error
	}
}

async function getAllPallets(_: void, args: any, context: any) {
	try {
		checkAuthentication(context)

		return await Pallet.find()
	} catch (error) {
		log.error(error)
		throw error
	}
}

async function palletUpdated(_: void, args: any) {
	return () => pubsub.asyncIterator(['PALLET_UPDATED'])
}

function checkAuthentication(context: any): boolean {
	if (!context.userId) {
		throw Error('Not authenticated')
	}
	return true
}

export {
	createPallet,
	updatePalletWeight,
	getPallet,
	getAllPallets,
	updateProductOfPallet,
	deletePallet
}
