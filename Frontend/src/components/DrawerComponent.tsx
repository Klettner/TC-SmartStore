import { Box, Button, Divider, Drawer, Typography } from "@mui/material"
// Icons
import HomeIcon from '@mui/icons-material/Home'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import SecurityIcon from '@mui/icons-material/Security'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import AddIcon from '@mui/icons-material/Add'
import ListIcon from '@mui/icons-material/List'
import LogoutIcon from '@mui/icons-material/Logout'
// Image
import logo_grey from "../images/logo_grey.png"
// Colors
import { grey } from "@mui/material/colors"
import UserService from "../services/UserService"
import { useContext } from "react"

import { AddProductContext, PalletsContext } from "../App"
import { IAddProduct } from "../models/addProduct"
import { AuthRoutes } from "../Router"
import { useNavigate } from "react-router-dom"

export const drawerWidth = 300

export default function DrawerComponent() {
	const palletsContext = useContext(PalletsContext)
	const addProductContext = useContext(AddProductContext)
	const navigate = useNavigate()

	const editProduct = (id: string = "") => {
		const newAddProduct: IAddProduct = {
			serialNumber: id,
			showOverlay: true,
			product: {
				title: palletsContext.pallets.filter(x => x.serialNumber === id)[0]?.product.title ?? "",
				weight: palletsContext.pallets.filter(x => x.serialNumber === id)[0]?.product.weight ?? 0,
			}
		}
		addProductContext.setAddProduct(newAddProduct)
	}

	return (
		<Drawer
			sx={{
				width: drawerWidth,
				flexShrink: 0,
				"& .MuiDrawer-paper": {
					width: drawerWidth,
					boxSizing: "border-box",
				},
			}}
			variant="permanent"
			anchor="left"
		>
			<Box alignSelf="center" sx={{
				backgroundImage: `url(${logo_grey})`,
				backgroundRepeat: 'no-repeat',
				backgroundColor: grey[200],
				backgroundPosition: 'center',
				height: "25%",
				width: "100%",
			}}>
			</Box>
			<Divider sx={{ marginBottom: "2ch" }} />
			<Box sx={{ marginInline: 2, width: "30ch" }} />
			<Button
				style={{
					justifyContent: "flex-start",
					paddingTop: "2ch",
					paddingBottom: "2ch",
				}}
				startIcon={
					<HomeIcon sx={{
						marginLeft: "1ch"
					}}
					/>
				}
				size="large"
				onClick={() => navigate(AuthRoutes.home)}
			>
				<Typography
					sx={{
						marginTop: "2px",
						padding: "0ch"
					}}
					color="textPrimary"
				>
					Home
				</Typography>
			</Button>
			<Button
				style={{
					justifyContent: "flex-start",
					paddingTop: "2ch",
					paddingBottom: "2ch",
				}}
				startIcon={
					<LocationOnIcon sx={{
						marginLeft: "1ch"
					}} />}
				size="large"
				onClick={() => navigate(AuthRoutes.locate)}
			>
				<Typography
					sx={{
						marginTop: "1px",
						padding: "0ch"
					}}
					color="textPrimary"
				>
					Locate Product
				</Typography>
			</Button>
			<Button
				style={{
					justifyContent: "flex-start",
					paddingTop: "2ch",
					paddingBottom: "2ch",
				}}
				startIcon={
					<QrCodeScannerIcon sx={{
						marginLeft: "1ch"
					}} />}
				size="large"
				disabled={false}
			>
				<Typography
					sx={{
						marginTop: "1px",
						padding: "0ch"
					}}
					color="textPrimary"
				>
					Scan Product
				</Typography>
			</Button>
			<Button
				style={{
					justifyContent: "flex-start",
					paddingTop: "2ch",
					paddingBottom: "2ch",
				}}
				startIcon={
					<AddIcon sx={{
						marginLeft: "1ch"
					}} />}
				size="large"
				onClick={() => editProduct()}
			>
				<Typography
					sx={{
						marginTop: "1px",
						padding: "0ch"
					}}
					color="textPrimary"
				>
					Add Product
				</Typography>
			</Button>
			<Button
				style={{
					justifyContent: "flex-start",
					paddingTop: "2ch",
					paddingBottom: "2ch",
				}}
				startIcon={
					<ListIcon sx={{
						marginLeft: "1ch"
					}} />}
				size="large"
				onClick={() => navigate(AuthRoutes.catalog)}
			>
				<Typography
					sx={{
						marginTop: "1px",
						padding: "0ch"
					}}
					color="textPrimary"
				>
					Product Catalog
				</Typography>
			</Button>
			<Button
				style={{
					justifyContent: "flex-start",
					paddingTop: "2ch",
					paddingBottom: "2ch",
				}}
				startIcon={
					<MenuBookIcon sx={{
						marginLeft: "1ch"
					}} />}
				size="large"
				disabled={false}
			>
				<Typography
					sx={{
						marginTop: "1px",
						padding: "0ch"
					}}
					color="textPrimary"
				>
					Trainings
				</Typography>
			</Button>
			<Button
				style={{
					justifyContent: "flex-start",
					paddingTop: "2ch",
					paddingBottom: "2ch",
				}}
				startIcon={
					<SecurityIcon sx={{
						marginLeft: "1ch"
					}} />}
				size="large"
				disabled={false}
			>
				<Typography
					sx={{
						marginTop: "1px",
						padding: "0ch"
					}}
					color="textPrimary"
				>
					Security
				</Typography>
			</Button>
			<Button
				style={{
					justifyContent: "flex-start",
					paddingTop: "2ch",
					paddingBottom: "2ch",
				}}
				startIcon={
					<LogoutIcon sx={{
						marginLeft: "1ch"
					}} />}
				size="large"
				disabled={false}
				onClick={UserService.logout}
			>
				<Typography
					sx={{
						marginTop: "1px",
						padding: "0ch"
					}}
					color="textPrimary"
				>
					Logout
				</Typography>
			</Button>
		</Drawer>
	)
}