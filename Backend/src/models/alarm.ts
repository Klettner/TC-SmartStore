import mongoose, { mongo } from "mongoose"

const alarmSchema = new mongoose.Schema({
	active: {
		type: Boolean,
		required: true
	},
	activated: {
		type: Boolean,
		required: true
	},
	incidentTime: [{
		type: String,
		requried: false
	}]
})

export interface IAlarm {
	active: boolean
	activated: boolean
	incidentTime: [string]
}

export interface AlarmDoc extends IAlarm, mongoose.Document {
	id: number
	_doc: any
}

interface AlarmModelInterface extends mongoose.Model<AlarmDoc> {
	build(attr: IAlarm): any
}

alarmSchema.statics.build = (attr: IAlarm) => {
	return new Alarm(attr)
}

const Alarm = mongoose.model<AlarmDoc, AlarmModelInterface>("Alarm", alarmSchema)

export { Alarm }
