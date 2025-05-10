import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';

// project import
import MainCard from '@/components/MainCard';

interface BreadcrumbsProps {
  navigation?: {
    items?: Array<any>;
  };
  title?: boolean;
  [key: string]: any; // catch-all for other props
}

interface MenuItem {
  type?: 'item' | 'collapse' | 'group';
  title?: string;
  url?: string;
  breadcrumbs?: boolean;
  children?: MenuItem[];
}

export default function Breadcrumbs({ navigation, title, ...others }: BreadcrumbsProps) {
  const location = useLocation();
  const [main, setMain] = useState<MenuItem | undefined>();
  const [item, setItem] = useState<MenuItem | undefined>();

  // set active item state
  const getCollapse = (menu: MenuItem) => {
    if (menu.children) {
      menu.children.forEach((collapse) => {
        if (collapse.type === 'collapse') {
          getCollapse(collapse);
        } else if (collapse.type === 'item') {
          if (location.pathname === collapse.url) {
            setMain(menu);
            setItem(collapse);
          }
        }
      });
    }
  };

  // Ensure breadcrumbs are updated when location changes
  useEffect(() => {
    if (navigation?.items) {
      navigation.items.forEach((menu: MenuItem) => {
        if (menu.type === 'group') {
          getCollapse(menu);
        }
      });
    }
  }, [location.pathname, navigation]); // Re-run when location changes

  let mainContent;
  let itemContent;
  let breadcrumbContent = <Typography />;
  let itemTitle = '';

  // collapse item
  if (main && main.type === 'collapse') {
    mainContent = (
      <Typography component={Link} to={document.location.pathname} variant="h6" sx={{ textDecoration: 'none' }} color="textSecondary">
        {main.title}
      </Typography>
    );
  }

  // items
  if (item && item.type === 'item') {
    itemTitle = item.title || '';
    itemContent = (
      <Typography variant="subtitle1" color="textPrimary">
        {itemTitle}
      </Typography>
    );

    // main
    if (item.breadcrumbs !== false) {
      breadcrumbContent = (
        <MainCard border={false} sx={{ bgcolor: 'transparent' }} {...others} content={false}>
          <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
            <Grid>
              <MuiBreadcrumbs aria-label="breadcrumb">
                <Typography component={Link} to="/" color="textSecondary" variant="h6" sx={{ textDecoration: 'none' }}>
                  Trang chủ
                </Typography>
                {mainContent}
                {itemContent}
              </MuiBreadcrumbs>
            </Grid>
            {/*{title && (*/}
            {/*  <Grid sx={{ mt: 2 }}>*/}
            {/*    <Typography variant="h5">{item.title}</Typography>*/}
            {/*  </Grid>*/}
            {/*)}*/}
          </Grid>
        </MainCard>
      );
    }
  }

  return breadcrumbContent;
}
