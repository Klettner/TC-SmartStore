import mongoose, { mongo } from "mongoose"

const pallettSchema = new mongoose.Schema({
	serialNumber: {
		type: String,
		required: true,
		unique: true
	},
	weight: {
		type: Number,
		required: true
	},
	product: {
		title: {
			type: String,
			required: false,
		},
		weight: {
			type: Number,
			required: false,
		}
	}
})

export interface IPallet {
	serialNumber: string
	weight: number
	product: {
		title: string,
		weight: number
	}
}

export interface PalletDoc extends IPallet, mongoose.Document {
	id: number
	_doc: any
}

interface PalletModelInterface extends mongoose.Model<PalletDoc> {
	build(attr: IPallet): any
}

pallettSchema.statics.build = (attr: IPallet) => {
	return new Pallet(attr)
}

const Pallet = mongoose.model<PalletDoc, PalletModelInterface>("Pallet", pallettSchema)

export { Pallet }
