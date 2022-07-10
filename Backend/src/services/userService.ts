import { Logger } from "tslog"
import { User, UserDoc, IUserWithPassword } from "../models/user"
export type UserLoginRegisterParams = IUserWithPassword
const log = new Logger({ name: "Register User" })

async function registerUser(registerParams: UserLoginRegisterParams): Promise<UserDoc> {
	log.debug("User RegisterParams", registerParams)
	const newUser = new User({
		email: registerParams.email,
		password: registerParams.password,
		firstName: registerParams.firstName,
		lastName: registerParams.lastName
	})

	log.debug("Save new user in db")
	await newUser.save()

	return newUser
}

export { registerUser }