// project import
import getColors from '@/utils/getColors';
import type { Theme } from "@mui/material/styles"

// ==============================|| CHIP - COLORS ||============================== //
interface ColorStyleProps {
  color: string;
  theme: Theme;
}

function getColor({ color, theme }: ColorStyleProps) {
  const colors = getColors(theme, color);
  const { dark } = colors;

  return {
    '&.Mui-focusVisible': {
      outline: `2px solid ${dark}`,
      outlineOffset: 2
    }
  };
}

function getColorStyle({ color, theme }: ColorStyleProps) {
  const colors = getColors(theme, color);
  const { light, lighter, main } = colors;

  return {
    color: main,
    backgroundColor: lighter,
    borderColor: light,
    '& .MuiChip-deleteIcon': {
      color: main,
      '&:hover': {
        color: light
      }
    }
  };
}

function generateChipStyles(variant: string, theme: Theme) {
  return {
    [`MuiChip-${variant}Primary`]: getColorStyle({ color: 'primary', theme }),
    [`MuiChip-${variant}Secondary`]: getColorStyle({ color: 'secondary', theme }),
    [`MuiChip-${variant}Error`]: getColorStyle({ color: 'error', theme }),
    [`MuiChip-${variant}Info`]: getColorStyle({ color: 'info', theme }),
    [`MuiChip-${variant}Success`]: getColorStyle({ color: 'success', theme }),
    [`MuiChip-${variant}Warning`]: getColorStyle({ color: 'warning', theme })
  };
}

// ==============================|| OVERRIDES - CHIP ||============================== //

export default function Chip(theme: Theme) {
  const defaultLightChip = getColorStyle({ color: 'secondary', theme });

  return {
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          '&:active': {
            boxShadow: 'none'
          },
          '&.MuiChip-colorPrimary': getColor({ color: 'primary', theme }),
          '&.MuiChip-colorSecondary': getColor({ color: 'secondary', theme }),
          '&.MuiChip-colorError': getColor({ color: 'error', theme }),
          '&.MuiChip-colorInfo': getColor({ color: 'info', theme }),
          '&.MuiChip-colorSuccess': getColor({ color: 'success', theme }),
          '&.MuiChip-colorWarning': getColor({ color: 'warning', theme })
        },
        sizeLarge: {
          fontSize: '1rem',
          height: 40
        },
        light: {
          ...defaultLightChip,
          ...generateChipStyles('light', theme)
        },
        combined: {
          border: '1px solid',
          ...defaultLightChip,
          ...generateChipStyles('combined', theme)
        }
      }
    }
  };
}
