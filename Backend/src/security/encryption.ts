import * as bcrypt from 'bcrypt'

const saltRounds = 12

export default class Encryption {

	public static encrypt(clearText: string): Promise<string> {
		return new Promise((resolve, reject) => {
			bcrypt.hash(clearText, saltRounds, (err, hash) => {
				if (err) {
					reject(err)
				}
				resolve(hash)
			})
		})
	}

	public static compare(clearText: string, hash: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			bcrypt.compare(clearText, hash, (err, res) => {
				if (err) {
					reject(err)
				}
				resolve(res)
			})
		})
	}
}
