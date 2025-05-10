import type { ReactNode } from "react"
import { useMemo } from "react"

// material-ui
import { CssBaseline, StyledEngineProvider } from "@mui/material"
import type { ThemeOptions } from "@mui/material/styles"
import { createTheme, ThemeProvider } from "@mui/material/styles"

// project import
import Palette from "./palette"
import Typography from "./typography"
import CustomShadows from "./shadows"
import componentsOverride from "./overrides"
import type { TypographyOptions } from "@mui/material/styles/createTypography"

// ==============================|| DEFAULT THEME - MAIN  ||============================== //

interface ThemeCustomizationProps {
  children: ReactNode;
}

export default function ThemeCustomization({ children }: ThemeCustomizationProps) {
  const theme = Palette("light", "default")

  const themeTypography = Typography(`'Public Sans', sans-serif`)
  const themeCustomShadows = useMemo(() => CustomShadows(theme), [theme])

  const themeOptions: ThemeOptions = useMemo(
    () => ({
      ...theme,
      breakpoints: {
        values: {
          xs: 0,
          sm: 768,
          md: 1024,
          lg: 1266,
          xl: 1440
        }
      },
      direction: "ltr",
      mixins: {
        toolbar: {
          minHeight: 60,
          paddingTop: 8,
          paddingBottom: 8
        }
      },
      palette: theme.palette,
      customShadows: themeCustomShadows,
      typography: themeTypography as TypographyOptions,
    }),
    [theme, themeTypography, themeCustomShadows]
  )

  const themes = createTheme(themeOptions)
  themes.components = componentsOverride(themes)

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
