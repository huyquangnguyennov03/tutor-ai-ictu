// material-ui
import Grid from "@mui/material/Grid2"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
// project import
import MainCard from "@/components/MainCard"
interface AnalyticEcommerceProps {
  title: string
  count: string
}
const AnalyticEcommerce: React.FC<AnalyticEcommerceProps> = ({
  title,
  count,
}) => {
  return (
    <MainCard contentSX={{ p: 2.25 }}>
      <Stack spacing={0.5}>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
        <Grid container alignItems="center">
          <Grid>
            <Typography variant="h4" color="inherit" sx={{ fontSize: "2rem" }}>
              {count}
            </Typography>
          </Grid>
        </Grid>
      </Stack>
    </MainCard>
  )
}

export default AnalyticEcommerce
