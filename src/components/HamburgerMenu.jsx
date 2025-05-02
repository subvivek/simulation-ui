import { 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Typography, 
  Avatar, 
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SearchIcon from '@mui/icons-material/Search'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const HamburgerMenu = ({ alertSkus = [], selectedLevel = '', onSkuClick = () => {} }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const navigate = useNavigate()

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNavigation = (path) => {
    navigate(path)
    handleClose()
  }

  const navSection = (title) => (
    <Typography
      variant="caption"
      sx={{ color: 'text.secondary', pl: 2, mt: 2, mb: 1 }}
    >
      {title}
    </Typography>
  )

  return (
    <Box>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={handleMenu}
        sx={{
          position: 'absolute',
          top: 10,
          left: 40,
        }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ 
          '& .MuiPaper-root': {
            width: 250,
            maxHeight: '80vh',
            overflow: 'auto'
          }
        }}
      >
        {/* User Profile */}
        <Box textAlign="center" p={2}>
          <Avatar
            alt="Kedar Kulkarni"
            src="https://media.licdn.com/dms/image/v2/C4D03AQG6G4el1k6-oQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1516269261844?e=1750291200&v=beta&t=HjNDuHRQhmDsYESfyTiHd39AQV5cPejay9S2FtGLRI8"
            sx={{ width: 60, height: 60, margin: 'auto' }}
          />
          <Typography variant="body1" fontWeight="bold" mt={1}>Kedar Kulkarni</Typography>
          <Typography variant="caption" color="success.main">CEO Fancy</Typography>
        </Box>

        <Divider />

        {/* Navigation Section */}
        <List component="nav" dense>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/')}>
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Pulse" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/deep-dive')}>
              <ListItemIcon><SearchIcon /></ListItemIcon>
              <ListItemText primary="Deep Dive" />
            </ListItemButton>
          </ListItem>
        </List>

        {/* Alert SKUs Section */}
        {alertSkus && alertSkus.length > 0 && (
          <>
            <Divider />
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
      </Menu>
    </Box>
  )
}

export default HamburgerMenu
