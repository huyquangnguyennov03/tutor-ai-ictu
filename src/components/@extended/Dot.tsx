import { FC } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import getColors from "@/utils/getColors"

// project import


// Định nghĩa các props
interface DotProps {
  color?: string;
  size?: number;
  variant?: 'filled' | 'outlined';
  sx?: object;
}

const Dot: FC<DotProps> = ({ color, size, variant, sx }) => {
  const theme = useTheme()
  const colors = getColors(theme, color || "primary")
  const { main } = colors;

  return (
    <Box
      sx={{
        width: size || 8,
        height: size || 8,
        borderRadius: '50%',
        bgcolor: variant === 'outlined' ? '' : main,
        ...(variant === 'outlined' && { border: `1px solid ${main}` }),
        ...sx
      }}
    />
  );
};

export default Dot;
