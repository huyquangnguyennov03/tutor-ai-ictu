import type { ReactNode } from 'react';

// material-ui
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import type { SxProps} from '@mui/system';
import type { Theme } from '@mui/material/styles';

// third-party
import SimpleBar from 'simplebar-react';
import { BrowserView, MobileView } from 'react-device-detect';

// root style
const RootStyle = styled(BrowserView)({
  flexGrow: 1,
  height: '100%',
  overflow: 'hidden'
});

// scroll bar wrapper
const SimpleBarStyle = styled(SimpleBar)(({ theme }) => ({
  maxHeight: '100%',
  '& .simplebar-scrollbar': {
    '&:before': {
      background: alpha(theme.palette.grey[500], 0.48)
    },
    '&.simplebar-visible:before': {
      opacity: 1
    }
  },
  '& .simplebar-track.simplebar-vertical': {
    width: 10
  },
  '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': {
    height: 6
  },
  '& .simplebar-mask': {
    zIndex: 'inherit'
  }
}));

// ==============================|| SIMPLE SCROLL BAR ||============================== //

// Define the props interface
interface SimpleBarScrollProps {
  children?: ReactNode;
  sx?: SxProps<Theme>;
  [key: string]: any; // For any additional props
}

export default function SimpleBarScroll({ children, sx, ...other }: SimpleBarScrollProps) {
  return (
      <>
        <RootStyle>
          <SimpleBarStyle clickOnTrack={false} sx={sx} {...other}>
            {children}
          </SimpleBarStyle>
        </RootStyle>
        <MobileView>
          <Box sx={{ overflowX: 'auto', ...sx }} {...other}>
            {children}
          </Box>
        </MobileView>
      </>
  );
}