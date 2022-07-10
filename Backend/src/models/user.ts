import mongoose from "mongoose"
import bcrypt from "bcrypt"
import { Logger } from "tslog"
const log = new Logger({ name: "User model" })

const salt: number = 12

const userSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
})


export interface IUser {
	firstName?: string
	lastName?: string
	email: string
}

export interface IUserWithPassword extends IUser {
	password: string
}

export interface UserDoc extends IUserWithPassword, mongoose.Document {
	id: number
	_doc: any
	fullName: string
	comparePasswords(candidatePassword: string, next: (err: Error | null, same: boolean | null) => void): void
}

// Virtual properties
userSchema.virtual("fullName").get(function(this: UserDoc) {
	return this.firstName + this.lastName
})

interface UserModelInterface extends mongoose.Model<UserDoc> {
	build(attr: IUser): any
}

userSchema.statics.build = (attr: IUser) => {
	return new User(attr)
}

// Document middlewares
userSchema.pre<UserDoc>("save", function(next) {
	log.debug("hashing password")
	if (this.isModified("password")) {
		bcrypt.hash(this.password, salt, (err: any, passwordHash: any) => {
			if (err) {
				log.debug("error occured while hashing", err)
				return next(err)
			}
			log.debug("hash password successful")
			this.password = passwordHash
			next()
		})
	}
})

userSchema.methods.comparePassword = function(
	this: UserDoc,
	candidatePassword: string,
	next: (err: Error | null, same: boolean | null) => void
): void {
	log.debug("comparing password")
	bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
		if (err) {
			log.debug("compare password error")
			return next(err, null)
		}
		else {
			log.debug("compare password successful")
			return next(null, isMatch)
		}
	})
}

const User = mongoose.model<UserDoc, UserModelInterface>("User", userSchema)

export { User }