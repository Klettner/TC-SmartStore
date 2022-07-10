import React, { useContext } from "react"
import { useTheme } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import useMediaQuery from '@mui/material/useMediaQuery'
import { IAddProduct } from "../../models/addProduct"
import { Button, Grid, MenuItem, TextField, Typography } from "@mui/material"
import { AddProductContext, PalletsContext } from "../../App"
import { IPallet } from "../../models/pallet"
// Icons
import ScaleIcon from '@mui/icons-material/Scale'
import { graphqlClientAuth, UPDATE_PRODUCT } from "../../graphql/graphql"

export default function AddProductView() {
	const theme = useTheme()
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
	const addProductContext = useContext(AddProductContext)
	const palletsContext = useContext(PalletsContext)

	const handleCancel = () => {
		const newAddProduct: IAddProduct = {
			serialNumber: "",
			showOverlay: false,
			product: {
				title: "",
				weight: 0
			}
		}
		addProductContext.setAddProduct(newAddProduct)
	}

	const handleSave = async () => {
		const currentSerialNumber = addProductContext.addProduct.serialNumber
		const currentPallet = palletsContext.pallets.filter(x => x.serialNumber === currentSerialNumber)[0]
		const newPallet: IPallet = {
			serialNumber: addProductContext.addProduct.serialNumber,
			weight: currentPallet?.weight,
			product: addProductContext.addProduct.product
		}
		const newPalletIndex = palletsContext.pallets.indexOf(currentPallet)
		const newPallets = palletsContext.pallets
		newPallets[newPalletIndex] = newPallet
		palletsContext.setPallets(newPallets)

		// Update Product in backend
		const client = graphqlClientAuth(window.localStorage.jwtToken)
		await client.request(UPDATE_PRODUCT, {
			serialNumber: currentSerialNumber,
			product: addProductContext.addProduct.product
		})

		const newAddProduct: IAddProduct = {
			serialNumber: "",
			showOverlay: false,
			product: {
				title: "",
				weight: 0
			}
		}
		addProductContext.setAddProduct(newAddProduct)
	}

	const handleMeasureWeight = () => {
		const currentSerialNumber = addProductContext.addProduct.serialNumber
		const newAddProduct: IAddProduct = {
			...addProductContext.addProduct,
			product: {
				title: addProductContext.addProduct.product.title,
				weight: palletsContext.pallets.filter(x => x.serialNumber === currentSerialNumber)[0]?.weight
			}
		}
		addProductContext.setAddProduct(newAddProduct)
	}

	const handleSerialNumberChange = (event: SelectChangeEvent) => {
		const newAddProduct: IAddProduct = {
			...addProductContext.addProduct,
			serialNumber: event.target.value as string
		}
		addProductContext.setAddProduct(newAddProduct)
	}

	const isSaveDisabled = (): boolean => {
		return addProductContext.addProduct.serialNumber === "" || addProductContext.addProduct.product.title === "" || addProductContext.addProduct.product.weight === 0
	}

	const setProductTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newAddProduct: IAddProduct = {
			...addProductContext.addProduct,
			product: {
				title: event.target.value,
				weight: addProductContext.addProduct.product.weight
			},
		}
		addProductContext.setAddProduct(newAddProduct)
	}

	const setProductWeight = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newAddProduct: IAddProduct = {
			...addProductContext.addProduct,
			product: {
				title: addProductContext.addProduct.product.title,
				weight: +event.target.value.trim()
			},
		}
		addProductContext.setAddProduct(newAddProduct)
	}

	return (
		<Dialog
			fullScreen={fullScreen}
			open={addProductContext.addProduct.showOverlay}
			onClose={handleCancel}

			aria-labelledby="form-dialog-title"
		>
			<DialogTitle
				id="form-dialog-title"
			>
				Add/Edit Product
			</DialogTitle>
			<DialogContent>
				<Grid container direction={"column"} spacing={3} alignItems="left" sx={{ paddingTop: "2ch" }}>
					<Grid item xs={12} sm={12}>
						<Typography variant="h6" color="textSecondary">
							Pallet ID
						</Typography>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Select
							value={addProductContext.addProduct.serialNumber}
							label="Pallet ID"
							onChange={handleSerialNumberChange}
						>
							{palletsContext.pallets.map(x =>
								<MenuItem key={x.serialNumber} value={x.serialNumber}>{x.serialNumber}</MenuItem>
							)}
						</Select>
					</Grid>
					<Grid item xs={12} sm={12} style={{ marginTop: theme.spacing(2) }}>
						<Typography variant="h6" color="textSecondary">
							Product name
						</Typography>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Product name"
							fullWidth
							value={addProductContext.addProduct.product.title}
							onChange={setProductTitle}
						/>
					</Grid>
					<Grid item xs={12} sm={6} style={{ marginTop: theme.spacing(2) }} sx={{ paddingRight: "8ch", paddingLeft: "4ch" }}>
						<Typography variant="h6" color="textSecondary">
							Weight of one instance
						</Typography>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Product weight in gramm"
							fullWidth
							value={addProductContext.addProduct.product.weight}
							onChange={setProductWeight}
						/>
						<Button
							variant="text"
							onClick={handleMeasureWeight}
							startIcon={<ScaleIcon />}
							sx={{ marginTop: "1ch" }}
							disabled={addProductContext.addProduct.serialNumber === ""}
						>
							Measure Weight
						</Button>
					</Grid>
					<Grid item xs={12} sm={6} />
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancel} color="info">
					Cancel
				</Button>
				<Button
					variant="outlined"
					onClick={handleSave}
					disabled={isSaveDisabled()}
					color="primary"
				>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	)
}