import React from "react"
import { createRoot } from 'react-dom/client'
import { createTheme, ThemeProvider } from "@mui/material"
import App from "./App"
// colors
import { orange, grey } from "@mui/material/colors"

const theme = createTheme({
	palette: {
		primary: {
			main: orange[600]
		},
		secondary: {
			main: orange[400]
		},
		info: {
			main: grey[600]
		}
	}
})

const root = createRoot(document.getElementById('root')!)
root.render(
	<ThemeProvider theme={theme}>
		<React.StrictMode>
			<App />
		</React.StrictMode>
	</ThemeProvider>
)