export interface IPallet {
	serialNumber: string,
	weight: number,
	product: {
		title: string,
		weight: number
	}
}

export const defaultPallet: IPallet = {
	serialNumber: "A1",
	weight: 5000,
	product: {
		title: "",
		weight: 0
	}
}

export const defaultPallets: IPallet[] = []