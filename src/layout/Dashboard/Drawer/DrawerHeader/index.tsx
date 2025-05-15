// project import
import DrawerHeaderStyled from './DrawerHeaderStyled';
import Logo from '@/components/logo';
import miniLogo from "@/assets/images/logoictu.png";
import Box from "@mui/material/Box"
import { ButtonBase } from "@mui/material"
import { Link } from "react-router-dom"
// ==============================|| DRAWER HEADER ||============================== //

type DrawerHeaderProps = {
    open?: boolean;
};

export default function DrawerHeader({ open }: DrawerHeaderProps) {
    return (
        <DrawerHeaderStyled open={!!open}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: open ? 'flex-start' : 'center',
                    width: '100%',
                    transition: (theme) => theme.transitions.create('all'),
                }}
            >
                {open ? (
                    <Logo />
                ) : (
                    <ButtonBase disableRipple component={Link} to={"/"} sx={{ width: 46, height: 46 }}>
                        <Box
                            sx={{
                                width: 60,
                                height: 60,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <img src={miniLogo} alt="Mini Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', paddingLeft: '4px' }} />
                        </Box>
                    </ButtonBase>
                )}
            </Box>
        </DrawerHeaderStyled>
    );
}
