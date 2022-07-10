import { Box, CssBaseline, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useContext, useEffect } from "react"
import { LocationContext, PalletsContext } from "../../App"
import AppBarComponent from "../../components/AppBarComponent"
import DrawerComponent from "../../components/DrawerComponent"
import { GET_PALLETS, graphqlClientAuth } from "../../graphql/graphql"
import { IPallet } from "../../models/pallet"
import AddProductView from "../AddProduct/AddProductView"
import useInterval from "@use-it/interval"
// Icons
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { AuthRoutes } from "../../Router"
import { ILocation } from "../../models/location"
import { useNavigate } from "react-router-dom"

export default function ProductCatalogView() {
	const palletsContext = useContext(PalletsContext)
	const locationContext = useContext(LocationContext)
	const pollingDelay = 3000
	const navigate = useNavigate()

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

	const numberOfProducts = (pallet: IPallet) => {
		const palletWeight: number = pallet.weight ?? 0
		const productWeight: number = pallet.product.weight ?? 0
		const productAmount: number = productWeight === 0 ? 0 : Math.ceil(palletWeight / productWeight)
		return productAmount.toLocaleString()
	}

	function createData(
		product: string,
		amount: number,
		weight: number,
		station: string,
		pallet: string,
	) {
		return { product, amount, weight, station, pallet }
	}

	const showLocation = (serialNumber: string) => {
		let latitude = 48.26815528021863
		let longitude = 11.66606256484967
		if (serialNumber === "B") {
			latitude = 48.26688401500519
			longitude = 11.665698170889302
		}
		if (serialNumber === "C") {
			latitude = 48.26466813961656
			longitude = 11.664864523819011
		}
		const newLocation: ILocation = {
			serialNumber,
			latitude,
			longitude
		}
		locationContext.setLocation(newLocation)
		navigate(AuthRoutes.locate)
	}

	const rows = [
		createData('Multiprop MP 120', 5, 10000, "B", "B1"),
		createData('Skydeck', 10, 5000, "C", "C1"),
		createData('Base MP 50', 56, 8900, "B", "B2"),
	]

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBarComponent />
			<DrawerComponent />
			<Grid container component="main">
				<CssBaseline />
				<Grid item xs={0} sm={0} md={0}/>
				<Grid item xs={12} sm={12} md={12} >
					<Grid container alignItems={"center"} direction={"column"} rowSpacing={"2ch"} sx={{ paddingTop: "15ch", paddingBottom: "8ch" }}>
						<Typography variant="h3">
							Product Catalog
						</Typography>
					</Grid>
					<Grid
						container
						alignItems={"center"}
						direction={"column-reverse"}
					>
						<TableContainer component={Paper}>
							<Table sx={{ minWidth: 650 }} aria-label="simple table">
								<TableHead>
									<TableRow>
										<TableCell>Product</TableCell>
										<TableCell align="right">Amount</TableCell>
										<TableCell align="right">Weight&nbsp;(g)</TableCell>
										<TableCell align="right">Station</TableCell>
										<TableCell align="right">Pallet</TableCell>
										<TableCell align="right">Location</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{palletsContext.pallets.map((row) => (
										<TableRow
											key={row.serialNumber}
											sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
										>
											<TableCell component="th" scope="row">
												{row.product.title}
											</TableCell>
											<TableCell align="right">{numberOfProducts(row)}</TableCell>
											<TableCell align="right">{row.product.weight}</TableCell>
											<TableCell align="right">A</TableCell>
											<TableCell align="right">{row.serialNumber}</TableCell>
											<TableCell align="right">{
												<IconButton
													onClick={() => showLocation(row.serialNumber)}
												>
													<LocationOnIcon color="secondary" />
												</IconButton>
											}
											</TableCell>
										</TableRow>
									))}
									{rows.map((row) => (
										<TableRow
											key={row.product}
											sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
										>
											<TableCell component="th" scope="row">
												{row.product}
											</TableCell>
											<TableCell align="right">{row.amount}</TableCell>
											<TableCell align="right">{row.weight}</TableCell>
											<TableCell align="right">{row.station}</TableCell>
											<TableCell align="right">{row.pallet}</TableCell>
											<TableCell align="right">{
												<IconButton
													onClick={() => showLocation(row.station)}
												>
													<LocationOnIcon color="secondary" />
												</IconButton>
											}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Grid>
				</Grid>
				<Grid item xs={0} sm={0} md={0} />
			</Grid>
			<AddProductView />
		</Box>
	)
}