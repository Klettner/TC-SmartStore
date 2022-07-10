import { useState } from "react"
// MaterialUI
import CssBaseline from "@mui/material/CssBaseline"
import Grid from "@mui/material/Grid"
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Box from "@mui/material/Box"
import { Dialog, DialogActions, DialogTitle, Paper } from "@mui/material"
// Images
import Logo from "../../images/logo_app.png"
import startImage from '../../images/pallet_station_lg.png'
// Colors
import { grey } from "@mui/material/colors"
import { AuthRoutes, NonAuthRoutes } from "../../Router"
import { useNavigate } from 'react-router-dom'
import { graphqlClient, LOGIN } from "../../graphql/graphql"

export default function SignInSide() {
	const [showDialog, setShowDialog] = useState<boolean>(false)
	const [password, setPassword] = useState<string>("")
	const navigate = useNavigate()

	const handleClose = () => {
		setShowDialog(false)
	}

	const handleLogin = async (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault()
		try {
			const response = await graphqlClient.request(LOGIN, {
				email: "tc_c1_2022@smartstore.de",
				password
			})
			window.localStorage.jwtToken = response.login.authToken.token
			navigate(AuthRoutes.home)
		} catch (response) {
			setShowDialog(true)
			navigate(NonAuthRoutes.signIn)
		}
	}

	return (
		<Grid container component="main" sx={{ height: '100vh' }}>
			<CssBaseline />
			<AppBar
				position="fixed"
				sx={{ width: `100%` }}
			>
				<Toolbar>
					<Typography variant="h6" noWrap component="div">
						Smart Store
					</Typography>
				</Toolbar>
			</AppBar>
			<Grid item xs={false} sm={4} md={7} sx={{
				backgroundImage: `url(${startImage})`,
				backgroundRepeat: 'no-repeat',
				backgroundColor: grey[50],
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				width: '100vw',
				height: '100vh'
			}} />
			<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
				<Box sx={{
					margin: '1ch',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					marginTop: "15ch"
				}}>
					<img src={Logo} height="125" width="125" alt="" />
					<Grid container sx={{ paddingTop: "2ch" }}>
						<Grid item xs>
							<Typography component="h1" align="center" variant="h4" >
								Station A
							</Typography>
						</Grid>
					</Grid>
					<Grid container>
						<Grid item xs>
							<Typography align="center" variant="h6">
								Login to continue!
							</Typography>
						</Grid>
					</Grid>
					<form noValidate>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							label="Enter Password"
							type="password"
							id="password"
							autoComplete="current-password"
							sx={{ marginTop: "4ch" }}
							value={password}
							onChange={(ev: React.ChangeEvent<HTMLInputElement>): void =>
								setPassword(ev.target.value)
							}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							sx={{ marginTop: "2ch", padding: "1ch" }}
							disabled={password.length < 4}
							onClick={handleLogin}
						>
							Login
						</Button>
					</form>
				</Box>
				<Dialog
					open={showDialog}
					onClose={handleClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">{"Wrong password, please try again"}</DialogTitle>
					<DialogActions>
						<Button onClick={handleClose} color="primary">
							Ok
						</Button>
					</DialogActions>
				</Dialog>
			</Grid>
		</Grid>
	)
}
