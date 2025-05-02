import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'   // <-- FIXED HERE
import { CssBaseline, ThemeProvider } from '@mui/material'
import { ColorModeContext, useMode } from './theme'

const Root = () => {
  const [theme, colorMode] = useMode()
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />)