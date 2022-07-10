import { AppBar, Toolbar, Typography } from "@mui/material"
import { drawerWidth } from "./DrawerComponent"

export default function AppBarComponent() {

	return (
		<AppBar
			position="fixed"
			sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
		>
			<Toolbar>
				<Typography variant="h6" noWrap component="div">
					Smart Store
				</Typography>
			</Toolbar>
		</AppBar>
	)
}