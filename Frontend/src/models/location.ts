export interface ILocation {
	serialNumber: string,
	latitude: number,
	longitude: number
}

export const defaultLocation: ILocation = {
	serialNumber: "A",
	latitude: 48.26815528021863,
	longitude: 11.66606256484967
}
