import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

import SignInView from './views/SignIn/SignInView'
import UserService from './services/UserService'
import HomeScreenView from './views/Home/HomeView'
import ProductCatalogView from './views/ProductCatalog/ProductCatalogView'
import LocateProductView from './views/LocateProduct/LocateProductView'

export enum AuthRoutes {
	home = '/home',
	catalog = '/catalog',
	locate = '/locate'
}

export enum NonAuthRoutes {
	default = '/',
	signIn = '/sign_in',
}

const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path={NonAuthRoutes.default} element={<SignInView />} />
				<Route path={NonAuthRoutes.signIn} element={<SignInView />} />
				<Route path={AuthRoutes.home} element={
					<RequireAuth>
						<HomeScreenView />
					</RequireAuth>
				} />
				<Route path={AuthRoutes.catalog} element={
					<RequireAuth>
						<ProductCatalogView />
					</RequireAuth>
				} />
				<Route path={AuthRoutes.locate} element={
					<RequireAuth>
						<LocateProductView />
					</RequireAuth>
				} />
				{/* Not Found */}
				<Route path="*" element={<Navigate to={NonAuthRoutes.signIn} replace />} />
			</Routes>
		</BrowserRouter>
	)
}

function RequireAuth({ children }: { children: JSX.Element }) {
	if (!UserService.isAuthenticated()) {
		return <Navigate to={NonAuthRoutes.signIn} replace />
	}

	return children
}

export default Router