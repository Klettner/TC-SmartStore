import { MongoError } from "mongodb"
import * as jwt from "jsonwebtoken"
import { Logger } from "tslog"
import {
	DataStoredInToken,
	TokenData,
} from "../../interfaces/api"

import { User, UserDoc } from "../../models/user"
import { registerUser } from "../../services/userService"
import Encryption from "../../security/encryption"

const log = new Logger({ name: "User Resolver" })

async function signup(_: void, args: any) {
	const fetchedUser: UserDoc = await User.findOne({ email: args.email })
	log.debug("fetchedUser: ", fetchedUser)

	if (fetchedUser instanceof MongoError) {
		log.debug("MongoError")
		return {
			isAuthenticated: false,
			message: fetchedUser.message
		}
	}
	if (fetchedUser) {
		log.debug("User already exists")
		return {
			isAuthenticated: false,
			message: 'User with this email already exists!'
		}
	}
	log.debug("Create new user")
	const newUser: UserDoc = await registerUser(args)

	log.debug("Create new Token")
	const token: TokenData = createToken(newUser)

	if (!token) {
		log.debug("Token creation not successful")
		return {
			isAuthenticated: false,
			message: 'Error signing payload'
		}
	}

	return {
		authToken: token,
		isAuthenticated: true,
		userId: newUser._id,
		message: 'User successfully created'
	}
}

async function login(_: void, args: any) {
	const password: string = args.password
	const fetchedUser: UserDoc = await User.findOne({ email: args.email })

	if (fetchedUser instanceof MongoError) {
		log.debug("MongoError")
		return {
			isAuthenticated: false,
			message: fetchedUser.message
		}
	}
	if (!fetchedUser || fetchedUser === null) {
		log.debug("User does not exist")
		return {
			isAuthenticated: false,
			message: 'Does not exist'
		}
	}
	const isMatched = await Encryption.compare(password, fetchedUser.password)
	if (!isMatched) {
		log.debug("Password does not match")
		return {
			isAuthenticated: false,
			message: 'Password does not match'
		}
	}
	const token: TokenData = createToken(fetchedUser)
	if (!token) {
		log.debug("Token creation not successful")
		return {
			isAuthenticated: false,
			message: 'Error signing payload'
		}
	}
	return {
		authToken: token,
		isAuthenticated: true,
		userId: fetchedUser._id,
		message: 'Successfully Authenticated'
	}
}

function createToken(user: UserDoc): TokenData {
	const secret = process.env.JWT_SECRET
	const dataStoredInToken: DataStoredInToken = {
		userId: user._id,
	}
	return {
		token: jwt.sign(dataStoredInToken, secret),
		user: user._id
	}
}

export { signup, login }
