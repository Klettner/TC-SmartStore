import { Box, CssBaseline } from "@mui/material"
import AppBarComponent from "../../components/AppBarComponent"
import DrawerComponent from "../../components/DrawerComponent"
import AddProductView from "../AddProduct/AddProductView"
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { useContext, useState } from "react"
import { LocationContext } from "../../App"
import Fab from '@mui/material/Fab'
import L from 'leaflet'
// Icons
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { ILocation } from "../../models/location"

const greenIcon = new L.Icon({
	iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
})


export default function LocateProductView() {
	const locationContext = useContext(LocationContext)
	const [myLocation, setMyLocation] = useState<ILocation>()

	const setDefaultLocation = () => {
		const currentLocation: ILocation = {
			serialNumber: "myLocation",
			latitude: 48.26772271387356,
			longitude: 11.664318891111062
		}
		setMyLocation(currentLocation)
	}

	const options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0,
	}

	const success = (position: any) => {
		const currentLocation: ILocation = {
			serialNumber: "myLocation",
			latitude: position.coords.latitude,
			longitude: position.coords.longitude,
		}
		setMyLocation(currentLocation)
	}

	const errors = () => {
		setDefaultLocation()
	}

	const setMyCurrentLocation = async () => {
		try {
			if (navigator.geolocation) {
				navigator.permissions
					.query({ name: "geolocation" })
					.then((result) => {
						if (result.state === "granted") {
							navigator.geolocation.getCurrentPosition(success)
						} else if (result.state === "prompt") {
							navigator.geolocation.getCurrentPosition(success, errors, options)
						} else if (result.state === "denied") {
							setDefaultLocation()
						}
					})
			} else {
				setDefaultLocation()
			}
		} catch (error) {
			setDefaultLocation()
		}
	}

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBarComponent />
			<DrawerComponent />
			<MapContainer
				center={[locationContext.location.latitude, locationContext.location.longitude]}
				zoom={18}
				maxZoom={18}
				style={{
					marginTop: "10ch",
					width: "85%",
					height: "92.9vh",
					zIndex: 1
				}}
			>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				/>

				<Marker position={[locationContext.location.latitude, locationContext.location.longitude]}>
					<Popup>
						{`Station ${locationContext.location.serialNumber}`}
					</Popup>
				</Marker>
				{myLocation ?
					<Marker position={[myLocation.latitude, myLocation.longitude]} icon={greenIcon}>
						<Popup>
							Current Position
						</Popup>
					</Marker> :
					<Box />
				}
				<Fab
					color="primary"
					aria-label="locate"
					sx={{ right: 30, bottom: 30, position: "fixed" }}
					onClick={() => setMyCurrentLocation()}
				>
					<LocationOnIcon />
				</Fab>
			</MapContainer>
			<AddProductView />
		</Box>
	)
}