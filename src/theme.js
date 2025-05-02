/*
import { createContext, useMemo, useState } from 'react'
import { createTheme } from '@mui/material/styles'

export const ColorModeContext = createContext({ toggleColorMode: () => {} })

export const useMode = () => {
  const [mode, setMode] = useState('dark')
  const colorMode = useMemo(() => ({
    toggleColorMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'dark')),
  }), [])

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      ...(mode === 'dark'
        ? {
            primary: { main: '#90caf9' },
            background: { default: '#121212', paper: '#1e1e1e' },
          }
        : {
            primary: { main: '#1976d2' },
            background: { default: '#fafafa', paper: '#fff' },
          }),
    },
  }), [mode])

  return [theme, colorMode]
}
*/
import { createContext, useMemo, useState } from 'react'
import { createTheme } from '@mui/material/styles'

export const ColorModeContext = createContext({ toggleColorMode: () => {} })

export const useMode = () => {
  const [mode, setMode] = useState(
    localStorage.getItem('mode') || 'dark'   // <- Start from previous or dark
  )

  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      const newMode = mode === 'light' ? 'dark' : 'light'
      setMode(newMode)
      localStorage.setItem('mode', newMode)  // <- Save it to browser
    }
  }), [mode])

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      ...(mode === 'dark'
        ? {
            primary: { main: '#90caf9' },
            background: { default: '#121212', paper: '#1e1e1e' },
          }
        : {
            primary: { main: '#1976d2' },
            background: { default: '#fafafa', paper: '#fff' },
          }),
    }
  }), [mode])

  return [theme, colorMode]
}
