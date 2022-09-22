import { createTheme } from '@mui/material/styles'

const palette = {
  type: 'dark',
  primary: { main: '#34495d' },
  secondary: { main: '#ee7738' },
}
const themeName = 'Oracle Cinnabar Duck'

export const changePalette = (type) => {
  return createTheme({ palette: { ...palette, type }, themeName })
}

export default createTheme({ palette, themeName })
