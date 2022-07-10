
export default class UserService {
	static isAuthenticated() {
		return window.localStorage.jwtToken !== undefined
	}

	static logout() {
		window.location.href = "/sign_in"
		window.localStorage.removeItem("jwtToken")
	}
}