import {
  Box,
  Typography,
  useTheme,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Collapse,
  IconButton,
} from '@mui/material'
import CampaignIcon from '@mui/icons-material/Campaign'  // Icon for promotions
import WarningIcon from '@mui/icons-material/Warning'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import { useState } from 'react'

const SidebarAlert = ({ alertSkus = [], selectedLevel = '', onSkuClick = () => {}, onBackToMenu = () => {}, activeSku = '' }) => {
  const theme = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [showResolved, setShowResolved] = useState(false)

  // Filter SKUs by search term first
  const filteredSkus = alertSkus.filter(({ sku_id }) => 
    sku_id.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Then split into unresolved and resolved
  const unresolvedSkus = filteredSkus.filter(sku => !sku.auto_action).sort((a, b) => b.ops_loss - a.ops_loss)
  const resolvedSkus = filteredSkus.filter(sku => sku.auto_action).sort((a, b) => b.ops_loss - a.ops_loss)

  const SkuListItem = ({ sku }) => (
    <ListItem disablePadding>
      <ListItemButton
        onClick={() => onSkuClick(sku.sku_id)}
        selected={sku.sku_id === activeSku}
        sx={{
          bgcolor: sku.sku_id === activeSku ? 'primary.light' : 'inherit',
          borderLeft: sku.sku_id === activeSku ? '4px solid #1976d2' : 'none',
          pl: sku.sku_id === activeSku ? 1 : 2
        }}
      >
        <ListItemText
          primary={
            <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
              <Box display="flex" alignItems="center" gap="5px">
                <Typography fontWeight="bold">{sku.sku_name || sku.sku_id}</Typography>
                {sku.isPromo && <CampaignIcon fontSize="small" color="secondary" />}
                {sku.isCritical && <WarningIcon fontSize="small" color="warning" />}
                {sku.auto_action && <AutoFixHighIcon fontSize="small" sx={{ color: '#2E7D32' }} />}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {Intl.NumberFormat('en', {
                  notation: 'compact',
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 1
                }).format(sku.ops_loss)}
              </Typography>
            </Box>
          }
          secondary="Projected Lost Sales"  // Now just showing OPS Loss for all SKUs
        />
      </ListItemButton>
    </ListItem>
  )

  return (
    <Box
      sx={{
        width: 200,
        flexShrink: 0,
        height: '100vh',
        backgroundColor: theme.palette.background.default,
        borderRight: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
        p: 2
      }}
    >
      {/* Back to Menu */}
      <Typography
        onClick={onBackToMenu}
        sx={{
          cursor: 'pointer',
          fontSize: '0.75rem',
          color: theme.palette.text.secondary,
          mb: 2,
          pl: 1
        }}
      >
        ⬅ Back to Menu
      </Typography>

      {/* Alert Level Heading */}
      <Typography variant="h6" fontWeight="bold" mb={1}>
        {selectedLevel?.toUpperCase()} Alert SKUs
      </Typography>

      {/* Search Field */}
      <TextField
        size="small"
        placeholder="Search SKU..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* Unresolved SKUs Section */}
      <Box sx={{ overflowY: 'auto', flex: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.error.main,
            mb: 1
          }}
        >
          Pending Resolution ({unresolvedSkus.length})
        </Typography>
        <List dense>
          {unresolvedSkus.map((sku, idx) => (
            <SkuListItem key={idx} sku={sku} />
          ))}
        </List>

        {/* Auto-resolved SKUs Section */}
        {resolvedSkus.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Box
              onClick={() => setShowResolved(!showResolved)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                mb: 1
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 'bold',
                  color: '#2E7D32',
                  flex: 1
                }}
              >
                Auto-resolved ({resolvedSkus.length})
              </Typography>
              <IconButton size="small">
                {showResolved ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            <Collapse in={showResolved}>
              <List dense>
                {resolvedSkus.map((sku, idx) => (
                  <SkuListItem key={idx} sku={sku} />
                ))}
              </List>
            </Collapse>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default SidebarAlert