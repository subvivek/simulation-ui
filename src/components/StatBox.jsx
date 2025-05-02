import { Box, Typography, useTheme } from '@mui/material'

const StatBox = ({ title, value, color, onClick }) => {
  const theme = useTheme()

  return (
    <Box
      onClick={onClick}
      sx={{
        flex: 1,
        minWidth: '150px',
        p: 2,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        textAlign: 'center',
        cursor: onClick ? 'pointer' : 'default',
        border: `2px solid ${theme.palette.divider}`,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: onClick ? 4 : 1,
          transform: onClick ? 'scale(1.03)' : 'none',
        }
      }}
    >
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ color }}>
        {value}
      </Typography>
    </Box>
  )
}

export default StatBox
