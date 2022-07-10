import { Logger } from "tslog"
import * as jwt from "jsonwebtoken"
const log = new Logger({ name: "TokenPayload Logger" })


function getTokenPayload(token) {
	const secret = process.env.JWT_SECRET
	return (jwt.verify(token, secret) as any)
}

export default function getUserId(req, authToken?) {
	if (req) {
		const authHeader = req.headers.authorization
		if (authHeader) {
			const token = authHeader.replace('Bearer ', '')
			if (!token) {
				throw new Error('No token found')
			}

			const { userId } = getTokenPayload(token)
			return userId
		}
	} else if (authToken) {
		const { userId } = getTokenPayload(authToken)
		return userId
	}

	throw new Error('Not authenticated')
}

export function checkAuthorization(context: any) {
	const { userId } = context
	if (!userId) {
		return Error('Not authenticated')
	}
	return userId
}
