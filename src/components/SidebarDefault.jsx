import {
    Box,
    Typography,
    useTheme,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Divider
  } from '@mui/material'
  import DashboardIcon from '@mui/icons-material/Dashboard'
  import SearchIcon from '@mui/icons-material/Search'
  import { NavLink } from 'react-router-dom'
  
  const Sidebar = ({ alertSkus = [], selectedLevel = '', onSkuClick = () => {} }) => {
    const theme = useTheme()
  
    const navSection = (title) => (
      <Typography
        variant="caption"
        sx={{ color: theme.palette.grey[500], pl: 2, mt: 2, mb: 1 }}
      >
        {title}
      </Typography>
    )
  
    return (
      <Box
        sx={{
          width: 250,
          backgroundColor: theme.palette.background.default,
          borderRight: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
          p: 2
        }}
      >
        {/* Logo/Header */}
        <Typography variant="h5" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>
          USER
        </Typography>
  
        {/* User Profile */}
        <Box textAlign="center" my={2}>
          <Avatar
            alt="Kedar Kulkarni"
            src="https://media.licdn.com/dms/image/v2/C4D03AQG6G4el1k6-oQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1516269261844?e=1750291200&v=beta&t=HjNDuHRQhmDsYESfyTiHd39AQV5cPejay9S2FtGLRI8"
            sx={{ width: 60, height: 60, margin: 'auto' }}
          />
          <Typography variant="body1" fontWeight="bold" mt={1}>Kedar Kulkarni</Typography>
          <Typography variant="caption" color="success.main">CEO Fancy</Typography>
        </Box>
  
        <Divider sx={{ mb: 1 }} />
  
        <List component="nav">
  
          {/* Dashboard Section */}
          <ListItem disablePadding>
            <ListItemButton component={NavLink} to="/" exact="true">
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Pulse" />
            </ListItemButton>
          </ListItem>
  
          <ListItem disablePadding>
            <ListItemButton component={NavLink} to="/deep-dive">
              <ListItemIcon><SearchIcon /></ListItemIcon>
              <ListItemText primary="Deep Dive" />
            </ListItemButton>
          </ListItem>
        </List>

        {/* Alert SKUs Section */}
        {alertSkus && alertSkus.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            {navSection(`${selectedLevel?.toUpperCase()} Alert SKUs`)}
            <List component="nav" dense>
              {alertSkus.map((sku, idx) => (
                <ListItem disablePadding key={idx}>
                  <ListItemButton onClick={() => onSkuClick(sku)}>
                    <ListItemText primary={sku} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </>
        )}

      </Box>
    )
  }
  
  export default Sidebar
  