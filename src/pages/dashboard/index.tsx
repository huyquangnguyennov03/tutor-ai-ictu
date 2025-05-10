import Grid from "@mui/material/Grid2"
import Typography from "@mui/material/Typography"

// ==============================|| DASHBOARD - DEFAULT ||============================== //

// Đổi DashboardDefault thành một functional component có kiểu dữ liệu rõ ràng
const DashboardDefault: React.FC = () => {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid size={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
    </Grid>
  )
}

export default DashboardDefault
