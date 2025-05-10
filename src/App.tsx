import { RouterProvider } from "react-router-dom"
import { SnackbarProvider } from "notistack" // Import SnackbarProvider

// project import
import router from "@/routes"
import ThemeCustomization from "@/themes"

import ScrollTop from "@/components/ScrollTop"
import { selectAuthenticated, selectRole } from "@/redux/slices/authSlice"
import { useAppSelector } from "@/redux/hooks"
import Loader from "@/components/Loader"
import "./App.scss"
import NoPermissionPage from "@/components/NoPermissionPage";
import {Roles} from "@/common/constants/roles";
// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

const App = () => {
  const isAuthenticated = useAppSelector(selectAuthenticated)
  const userRole = useAppSelector(selectRole)

  return (
    !isAuthenticated ?
      <Loader></Loader> :
          <ThemeCustomization>
            <SnackbarProvider maxSnack={5} anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
              <ScrollTop>
                <RouterProvider router={router}/>
              </ScrollTop>
            </SnackbarProvider>
          </ThemeCustomization>
  )
}

export default App