export interface TokenData {
	user: string
	token: string
}

export interface DataStoredInToken {
	userId: string
}

export interface LoginRegisterResponse {
	isAuthenticated: boolean
	authToken?: TokenData
	userId?: string
	message: string
}
