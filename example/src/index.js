import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { changePalette } from './theme'
import { ThemeProvider } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'

import './index.css'
import App from './App'

const Root = () => {
  const [paletteType, setPaletteType] = useState('dark')
  const [theme, setTheme] = useState(changePalette(paletteType))

  useEffect(() => {
    setTheme(changePalette(paletteType))
  }, [paletteType])

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <App setPalette={setPaletteType} />
      </SnackbarProvider>
    </ThemeProvider>
  )
}

const container = document.getElementById('root')
const root = createRoot(container) // createRoot(container!) if you use TypeScript
root.render(<Root />)
