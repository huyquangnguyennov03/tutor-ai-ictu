import { forwardRef, ReactNode } from 'react';

// MUI
import MuiIconButton, { IconButtonProps as MuiIconButtonProps } from '@mui/material/IconButton';
import { alpha, styled, Theme } from '@mui/material/styles';

// Utils
import getColors from '@/utils/getColors';
import getShadow from '@/utils/getShadow';

// Type Definitions
type VariantType = 'text' | 'contained' | 'light' | 'outlined' | 'dashed' | 'shadow';
type ShapeType = 'square' | 'rounded';

interface CustomIconButtonProps extends Omit<MuiIconButtonProps, 'color'> {
  variant?: VariantType;
  shape?: ShapeType;
  color?: string; // custom theme color name
  children?: ReactNode;
}

// Custom color style logic
function getColorStyle({
                         variant = 'text',
                         theme,
                         color = 'primary'
                       }: {
  variant?: VariantType;
  theme: Theme;
  color?: string;
}) {
  const colors = getColors(theme, color);
  const { lighter, light, dark, main, contrastText } = colors;

  const buttonShadow = `${color}Button`;
  const shadows = getShadow(theme, buttonShadow);

  const commonShadow = {
    '&::after': {
      boxShadow: `0 0 6px 6px ${alpha(main, 0.9)}`
    },
    '&:active::after': {
      boxShadow: `0 0 0 0 ${alpha(main, 0.9)}`
    },
    '&:focus-visible': {
      outline: `2px solid ${dark}`,
      outlineOffset: 2
    }
  };

  switch (variant) {
    case 'contained':
      return {
        color: contrastText,
        background: main,
        '&:hover': {
          background: dark
        },
        ...commonShadow
      };
    case 'light':
      return {
        color: main,
        background: lighter,
        '&:hover': {
          background: alpha(light, 0.5)
        },
        ...commonShadow
      };
    case 'shadow':
      return {
        boxShadow: shadows,
        color: contrastText,
        background: main,
        '&:hover': {
          boxShadow: 'none',
          background: dark
        },
        ...commonShadow
      };
    case 'outlined':
      return {
        '&:hover': {
          background: 'transparent',
          color: dark,
          borderColor: dark
        },
        ...commonShadow
      };
    case 'dashed':
      return {
        background: lighter,
        '&:hover': {
          color: dark,
          borderColor: dark
        },
        ...commonShadow
      };
    case 'text':
    default:
      return {
        '&:hover': {
          color: dark,
          background: color === 'secondary' ? alpha(light, 0.1) : lighter
        },
        ...commonShadow
      };
  }
}

// Styled Component
const IconButtonStyle = styled(MuiIconButton, {
  shouldForwardProp: (prop) => !['variant', 'shape', 'customcolor'].includes(prop as string)
})<{
  variant?: VariantType;
  shape?: ShapeType;
  customcolor?: string;
}>(({ theme, variant, shape, customcolor }) => ({
  position: 'relative',
  '::after': {
    content: '""',
    display: 'block',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    borderRadius: shape === 'rounded' ? '50%' : 4,
    opacity: 0,
    transition: 'all 0.5s'
  },
  ':active::after': {
    opacity: 1,
    transition: '0s'
  },
  ...(getColorStyle({ variant, theme, color: customcolor })),
  ...(variant !== 'text' && {
    '&.Mui-disabled': {
      background: theme.palette.grey[200],
      '&:hover': {
        background: theme.palette.grey[200],
        color: theme.palette.grey[300],
        borderColor: 'inherit'
      }
    }
  }),
  ...(variant === 'outlined' && {
    border: '1px solid',
    borderColor: 'inherit'
  }),
  ...(variant === 'dashed' && {
    border: '1px dashed',
    borderColor: 'inherit'
  })
}));

// Component Definition
const IconButton = forwardRef<HTMLButtonElement, CustomIconButtonProps>(
  ({ variant = 'text', shape = 'square', children, color = 'primary', ...others }, ref) => {
    return (
      <IconButtonStyle
        ref={ref}
        disableRipple
        variant={variant}
        shape={shape}
        customcolor={color} // pass color safely to styled, not to MuiIconButton
        {...others}
      >
        {children}
      </IconButtonStyle>
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;