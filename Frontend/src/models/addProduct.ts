import { IProduct } from "./product"

export interface IAddProduct {
	showOverlay: boolean,
	serialNumber: string,
	product: IProduct
}

export const defaultAddProduct: IAddProduct = {
	showOverlay: false,
	serialNumber: "",
	product: {
		title: "",
		weight: 0
	}
}
