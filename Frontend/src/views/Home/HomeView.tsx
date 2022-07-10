import React, { useContext, useEffect } from "react"
// MaterialUI
import CssBaseline from "@mui/material/CssBaseline"
import Grid from "@mui/material/Grid"
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { CardActionArea } from "@mui/material"
// Image
import wood_blur from '../../images/wood_blur.jpg'

import { AddProductContext, PalletsContext } from "../../App"
import { IAddProduct } from "../../models/addProduct"
import AddProductView from "../AddProduct/AddProductView"
import { GET_PALLETS, graphqlClientAuth } from "../../graphql/graphql"
import { IPallet } from "../../models/pallet"
import useInterval from '@use-it/interval'
import AppBarComponent from "../../components/AppBarComponent"
import DrawerComponent from "../../components/DrawerComponent"

export default function SignInSide() {
	const palletsContext = useContext(PalletsContext)
	const addProductContext = useContext(AddProductContext)
	const pollingDelay = 1500

	useInterval(() => {
		fetchPallets()
	}, pollingDelay)

	useEffect(() => {
		fetchPallets()
		// eslint-disable-next-line
	}, [])

	const fetchPallets = async () => {
		try {
			const client = graphqlClientAuth(window.localStorage.jwtToken)
			const result = await client.request(GET_PALLETS)
			const receivedPallets: IPallet[] = result.getAllPallets

			palletsContext.setPallets(receivedPallets)
		} catch (error) {
			// tslint:disable-next-line:no-console
			console.log(error)
		}
	}

	const numberOfProducts = (index: number) => {
		const palletWeight: number = palletsContext.pallets[index]?.weight ?? 0
		const productWeight: number = palletsContext.pallets[index]?.product.weight ?? 0
		const productAmount: number = productWeight === 0 ? 0 : Math.ceil(palletWeight / productWeight)
		return productAmount.toLocaleString()
	}

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
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBarComponent />
			<DrawerComponent />
			<Grid container component="main">
				<CssBaseline />
				<Grid item xs={2} sm={3} md={3} />
				<Grid item xs={8} sm={6} md={6} >
					<Grid container alignItems={"center"} direction={"column"} rowSpacing={"2ch"} sx={{ paddingTop: "15ch", paddingBottom: "10ch" }}>
						<Typography variant="h3">
							Station A
						</Typography>
					</Grid>
					<Grid
						container
						alignItems={"center"}
						direction={"column-reverse"}
					>
						<Grid
							paddingBottom={"4ch"}
						>
							{palletsContext.pallets.length > 0 ? (
								<Card
									elevation={15}
									sx={{ minWidth: 275, minHeight: 275 }}
									style={{
										backgroundImage: `url(${wood_blur})`
									}}
								>
									<CardActionArea
										onClick={() => editProduct(palletsContext.pallets[0].serialNumber)}
									>
										<CardContent>
											<Typography variant="h4" component="div" align="center" gutterBottom>
												{`Pallet ${palletsContext.pallets[0]?.serialNumber ?? ""}`}
											</Typography>
											<Typography variant="h6" component="div">
												Product
											</Typography>
											<Typography sx={{ mb: 1.5 }} color="text.secondary">
												{palletsContext.pallets[0]?.product.title ?? ""}
											</Typography>
											<Typography variant="h6" component="div">
												Amount
											</Typography>
											<Typography sx={{ mb: 1.5 }} color="text.secondary">
												{numberOfProducts(0)}
											</Typography>
											<Typography variant="h6" component="div">
												Weight per Item
											</Typography>
											<Typography sx={{ mb: 0 }} color="text.secondary">
												{`${palletsContext.pallets[0]?.product.weight ?? 0}g`}
											</Typography>
										</CardContent>
									</CardActionArea>
								</Card>
							) : (
								<Box />
							)}
						</Grid>
						<Grid
							paddingBottom={"4ch"}
						>
							{palletsContext.pallets.length > 1 ? (
								<Card
									elevation={15}
									sx={{ minWidth: 275, minHeight: 275 }}
									style={{
										backgroundImage: `url(${wood_blur})`
									}}
								>
									<CardActionArea
										onClick={() => editProduct(palletsContext.pallets[1].serialNumber)}
									>
										<CardContent>
											<Typography variant="h4" component="div" align="center" gutterBottom>
												{`Pallet ${palletsContext.pallets[1].serialNumber}`}
											</Typography>
											<Typography variant="h6" component="div">
												Product
											</Typography>
											<Typography sx={{ mb: 1.5 }} color="text.secondary">
												{palletsContext.pallets[1].product.title}
											</Typography>
											<Typography variant="h6" component="div">
												Amount
											</Typography>
											<Typography sx={{ mb: 1.5 }} color="text.secondary">
												{numberOfProducts(1)}
											</Typography>
											<Typography variant="h6" component="div">
												Weight per Item
											</Typography>
											<Typography sx={{ mb: 0 }} color="text.secondary">
												{`${palletsContext.pallets[1].product.weight}g`}
											</Typography>
										</CardContent>
									</CardActionArea>
								</Card>
							) : (
								<Box />
							)
							}
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={2} sm={3} md={3} />
			</Grid>
			<AddProductView />
		</Box>
	)
}
