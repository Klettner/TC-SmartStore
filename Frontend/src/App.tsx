import React, { createContext, useState } from "react"
import { IPallet, defaultPallets } from "./models/pallet"
import { IAddProduct, defaultAddProduct } from "./models/addProduct"
import Router from "./Router"
import { defaultLocation, ILocation } from "./models/location"

interface IPalletsContextProps {
	pallets: IPallet[]
	setPallets: React.Dispatch<React.SetStateAction<IPallet[]>>
}

interface IAddProductContextProps {
	addProduct: IAddProduct
	setAddProduct: React.Dispatch<React.SetStateAction<IAddProduct>>
}

interface ILocationContextProps {
	location: ILocation
	setLocation: React.Dispatch<React.SetStateAction<ILocation>>
}

export const PalletsContext = createContext({} as IPalletsContextProps)
export const AddProductContext = createContext({} as IAddProductContextProps)
export const LocationContext = createContext({} as ILocationContextProps)

function App() {
	const [pallets, setPallets] = useState(defaultPallets)
	const [addProduct, setAddProduct] = useState(defaultAddProduct)
	const [location, setLocation] = useState(defaultLocation)

	return (
		<PalletsContext.Provider value={{ pallets, setPallets }}>
			<AddProductContext.Provider value={{ addProduct, setAddProduct }}>
				<LocationContext.Provider value={{ location, setLocation }}>
					<Router />
				</LocationContext.Provider>
			</AddProductContext.Provider>
		</PalletsContext.Provider>
	)
}

export default App
