import { Box, Typography, useTheme, Select, MenuItem, FormControl, InputLabel, List, ListItem, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material'
import { useState, useEffect } from 'react'
import StatBox from '../components/StatBox'
import Chart from '../components/Chart'
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck'

const Pulse = ({ setAlertSkus, setSelectedLevel, onSkuClick }) => {
  const theme = useTheme()
  const [selectedMetric, setSelectedMetric] = useState('fillRate')
  const [promotionSkus, setPromotionSkus] = useState([])
  const [criticalSkus, setCriticalSkus] = useState([])

  const [instockData, setInstockData] = useState([])
  const [coverData, setCoverData] = useState([])
  const [alertCounts, setAlertCounts] = useState({ red: 0, yellow: 0, regular: 0 })
  const [vendorFillRate, setVendorFillRate] = useState([])
  const [vendorOnTimeRate, setVendorOnTimeRate] = useState([])
  const [forecastError, setForecastError] = useState([])
  const [alertsAnalysis, setAlertsAnalysis] = useState('')
  const [fulfilledVsUnfulfilled, setFulfilledVsUnfulfilled] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/pulse-metrics')
      .then((res) => res.json())
      .then((data) => {
        setInstockData(data.instockRate)
        setCoverData(data.daysOfCover)
        setVendorFillRate(data.vendorFillRate || [])
        setVendorOnTimeRate(data.vendorOnTimeRate || [])
        setForecastError(data.forecastError || [])
        setFulfilledVsUnfulfilled(data.fulfilledVsUnfulfilled || [])
      })      
      .catch((err) => console.error('Failed to fetch pulse metrics:', err))

    fetch('http://127.0.0.1:5000/api/alert-counts')
      .then((res) => res.json())
      .then((data) => setAlertCounts(data))
      .catch((err) => console.error('Failed to fetch alert counts:', err))

    // Fetch promotion SKUs
    fetch('http://127.0.0.1:5000/api/promotion-skus')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error('Failed to fetch promotion SKUs:', data.error)
          setPromotionSkus([])
        } else {
          setPromotionSkus(data)
        }
      })
      .catch((err) => {
        console.error('Failed to fetch promotion SKUs:', err)
        setPromotionSkus([])
      })

    // Fetch critical SKUs
    fetch('http://127.0.0.1:5000/api/critical-skus')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error('Failed to fetch critical SKUs:', data.error)
          setCriticalSkus([])
        } else {
          setCriticalSkus(data)
        }
      })
      .catch((err) => {
        console.error('Failed to fetch critical SKUs:', err)
        setCriticalSkus([])
      })

    // Add this new fetch for alerts analysis
    fetch('http://127.0.0.1:5000/api/alerts/summary')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error('Failed to fetch alerts summary:', data.error)
        } else {
          setAlertsAnalysis(data.analysis)
        }
      })
      .catch((err) => console.error('Failed to fetch alerts summary:', err))
  }, [])

  const handleAlertClick = (level) => {
    setSelectedLevel(level)

    fetch(`http://127.0.0.1:5000/api/alerts/skus?level=${level}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setAlertSkus(data)
          const firstUnresolved = data.find(sku => !sku.auto_action)
          const skuToSelect = firstUnresolved ? firstUnresolved.sku_id : data[0].sku_id
          onSkuClick(skuToSelect)   
        } else {
          setAlertSkus([])
        }
      })
      .catch((err) => {
        console.error('Failed to fetch alert SKUs:', err)
        setAlertSkus([])
      })
  }

  const getSelectedMetricData = () => {
    switch (selectedMetric) {
      case 'fillRate':
        return { data: vendorFillRate, title: 'Vendor Fill Rate', color: theme.palette.info.main }
      case 'onTimeRate':
        return { data: vendorOnTimeRate, title: 'PO On-Time Rate', color: theme.palette.success.main }
      case 'forecastError':
        return { data: forecastError, title: 'Forecast Error', color: theme.palette.warning.main }
      default:
        return { data: vendorFillRate, title: 'Vendor Fill Rate', color: theme.palette.info.main }
    }
  }

  const getAlertLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'red':
        return '#D32F2F';
      case 'yellow':
        return '#F57C00';
      case 'regular':
        return '#2E7D32';
      default:
        return theme.palette.text.primary;  // default text color for 'none'
    }
  };

  return (
    <Box mt="2px" mx="40px" mb="12px">
      {/* SECTION 1: Alerts */}
      <Box sx={{ 
        pt: 2,
        pb: 2
      }}>
        <Typography variant="h3" fontWeight="bold" mb="20px">
          Supply Chain Pulse
        </Typography>

        <Box display="flex" flexDirection="row" gap="24px" mb="40px">
          {/* Alert Buttons Column */}
          <Box
            flex="0 0 100px"
            display="flex"
            flexDirection="column"
            gap="12px"
            alignItems="stretch"
            justifyContent="flex-start"
          >
            <StatBox
              title="Red Alerts"
              value={alertCounts.red}
              color="error.main"
              onClick={() => handleAlertClick('red')}
              sx={{ minHeight: 32, fontSize: '0.85rem', p: 1, '& .MuiTypography-root': { fontSize: '0.85rem' } }}
            />
            <StatBox
              title="Yellow Alerts"
              value={alertCounts.yellow}
              color="warning.main"
              onClick={() => handleAlertClick('yellow')}
              sx={{ minHeight: 32, fontSize: '0.85rem', p: 1, '& .MuiTypography-root': { fontSize: '0.85rem' } }}
            />
            <StatBox
              title="Regular Alerts"
              value={alertCounts.regular}
              color="success.main"
              onClick={() => handleAlertClick('regular')}
              sx={{ minHeight: 32, fontSize: '0.85rem', p: 1, '& .MuiTypography-root': { fontSize: '0.85rem' } }}
            />
          </Box>

          {/* Output KPI Graphs */}
          <Box flex="1" display="flex" flexWrap="wrap" justifyContent="space-between" gap="20px">
            <Chart
              title="Instock Rate by Day"
              data={instockData}
              type="line"
              color={theme.palette.primary.main}
              referenceLineY={0.95}
              referenceLineLabel="Goal: 95%"
              yAxisTickFormatter={v => `${(v * 100).toFixed(0)}%`}
            />
            <Chart
              title="Fulfilled demand vs Lost Sales"
              data={fulfilledVsUnfulfilled}
              type="line"
              yAxisDomain={[0, 'auto']}
              lines={[
                { key: 'fulfilled', label: 'Fulfilled Demand', color: theme.palette.success.main },
                { key: 'unfulfilled', label: 'Lost Sales', color: theme.palette.error.main },
              ]}
            />

          </Box>
        </Box>

        {/* Root Cause Analysis below the buttons, full width */}
        <Box
          mb="16px"
          p="0"
          width="100%"
          bgcolor="transparent"
          borderRadius="4px"
          boxShadow={0}
        >
          {/* Header with Icon */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 2
            }}
          >
            <NetworkCheckIcon 
              sx={{ 
                fontSize: '28px',
                color: theme.palette.primary.main
              }} 
            />
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: theme.palette.text.primary }}
            >
              Network Health Summary
            </Typography>
          </Box>

          {/* Analysis Content */}
          <Box
            sx={{
              bgcolor: theme => theme.palette.background.paper,
              borderLeft: '6px solid #0D1A4A',
              borderRadius: 2,
              p: 2,
              boxShadow: 1,
              width: '100%',
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            <Typography
              variant="body1"
              sx={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                fontSize: '1rem',
                textAlign: 'justify',
              }}
              dangerouslySetInnerHTML={{ __html: alertsAnalysis }}
            />
          </Box>
        </Box>
      </Box>

      {/* SECTION 3: Input KPIs */}
      <Box display="flex" alignItems="center" mb="10px" gap={2}>
        <Typography variant="h5" fontWeight="bold">
          🔍 Input KPIs
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select Metric</InputLabel>
          <Select
            value={selectedMetric}
            label="Select Metric"
            onChange={(e) => setSelectedMetric(e.target.value)}
          >
            <MenuItem value="fillRate">Vendor Fill Rate</MenuItem>
            <MenuItem value="onTimeRate">PO On-Time Rate</MenuItem>
            <MenuItem value="forecastError">Forecast Error</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box display="flex" gap="20px" mb="40px" sx={{ pr: 8 }}>
        {/* Input KPIs Section - 45% */}
        <Box flex="0 0 45%" minWidth="250px">
          <Chart 
            title={getSelectedMetricData().title} 
            data={getSelectedMetricData().data} 
            type="line" 
            color={getSelectedMetricData().color} 
          />
        </Box>

        {/* Promotion Health Section - 35% */}
        <Box flex="0 0 35%" minWidth="200px">
          <Typography
            variant="h6"
            fontWeight="bold"
            mb="10px"
            align="center"
          >
            🎯 Promotion Health
          </Typography>
          <Box
            sx={{
              height: '400px',
              overflow: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {promotionSkus.length > 0 ? (
              <List dense>
                {promotionSkus.map((sku) => (
                  <ListItem 
                    key={sku.sku_id} 
                    disablePadding 
                    sx={{ 
                      mb: 2,
                      cursor: sku.stockout_days.length > 0 ? 'pointer' : 'default',
                      '&:hover': {
                        bgcolor: sku.stockout_days.length > 0 ? 'action.hover' : 'transparent'
                      }
                    }}
                    onClick={() => {
                      if (sku.stockout_days.length > 0) {
                        // First set the alert level to red
                        setSelectedLevel('red');
                        
                        // Then fetch the red alerts
                        fetch(`http://127.0.0.1:5000/api/alerts/skus?level=red`)
                          .then((res) => res.json())
                          .then((data) => {
                            if (data && data.length > 0) {
                              setAlertSkus(data);
                              // Find and select the clicked SKU
                              const clickedSku = data.find(alert => alert.sku_id === sku.sku_id);
                              if (clickedSku) {
                                onSkuClick(clickedSku.sku_id);
                              }
                            }
                          })
                          .catch((err) => {
                            console.error('Failed to fetch alert SKUs:', err);
                            setAlertSkus([]);
                          });
                      }
                    }}
                  >
                    <Box width="100%">
                      <Box display="flex" gap={1}>
                        {/* Column 1: SKU name */}
                        <Box width="100px">
                          <Typography 
                            variant="body2" 
                            fontWeight="bold" 
                            noWrap
                            sx={{ 
                              color: sku.stockout_days.length > 0 ? 'error.main' : 'text.primary'
                            }}
                          >
                            {sku.sku_name}
                          </Typography>
                        </Box>
                        
                        {/* Column 2: Metrics and inventory blocks */}
                        <Box flex="1">
                          {/* Row 1: Metrics */}
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                            <Box display="flex" gap={2}>
                              <Typography variant="caption" color="text.secondary">
                                Demand Lift: {sku.lift_factor}x
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Coverage: {Math.round((sku.daily_inventory.filter(day => 
                                  !day.is_stockout
                                ).length / sku.daily_inventory.length) * 100)}%
                              </Typography>
                            </Box>
                          </Box>
                          
                          {/* Row 2: Inventory blocks */}
                          <Box display="flex" gap={0.5} flexWrap="wrap">
                            {sku.daily_inventory.map((day) => (
                              <Box
                                key={day.day}
                                sx={{
                                  width: '20px',
                                  height: '15px',
                                  borderRadius: '4px',
                                  bgcolor: day.is_stockout ? theme.palette.error.main : theme.palette.success.main,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Typography variant="caption" sx={{ color: 'white', fontSize: '0.6rem' }}>
                                  {day.day}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                          
                          {sku.stockout_days.length > 0 && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                              Stockout risk on days: {sku.stockout_days.join(', ')}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary" textAlign="center">
                No active promotions
              </Typography>
            )}
          </Box>
        </Box>

        {/* Critical SKUs Section - 20% */}
        <Box flex="0 0 20%" minWidth="150px">
          <Typography
            variant="h6"
            fontWeight="bold"
            mb="10px"
            align="center"
          >
            ⚠️ Critical SKU Health
          </Typography>
          <TableContainer 
            component={Paper} 
            sx={{ 
              height: '400px',
              overflow: 'auto',
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: theme.palette.background.paper }}>
                    SKU
                  </TableCell>
                  <TableCell 
                    align="center" 
                    sx={{ fontWeight: 'bold', backgroundColor: theme.palette.background.paper }}
                  >
                    Instock Rate
                  </TableCell>
                  <TableCell 
                    align="center" 
                    sx={{ fontWeight: 'bold', backgroundColor: theme.palette.background.paper }}
                  >
                    DoC
                  </TableCell>
                  <TableCell 
                    align="center" 
                    sx={{ fontWeight: 'bold', backgroundColor: theme.palette.background.paper }}
                  >
                    Alert
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {criticalSkus.map((sku) => (
                  <TableRow 
                    key={sku.sku}
                    hover
                    onClick={() => {
                      if (sku.alert_level === 'red') {
                        setSelectedLevel('red');
                        fetch(`http://127.0.0.1:5000/api/alerts/skus?level=red`)
                          .then((res) => res.json())
                          .then((data) => {
                            if (data && data.length > 0) {
                              setAlertSkus(data);
                              const clickedSku = data.find(alert => alert.sku_id === sku.sku);
                              if (clickedSku) {
                                onSkuClick(clickedSku.sku_id);
                              }
                            }
                          })
                          .catch((err) => {
                            console.error('Failed to fetch alert SKUs:', err);
                            setAlertSkus([]);
                          });
                      }
                    }}
                    sx={{ 
                      cursor: sku.alert_level === 'red' ? 'pointer' : 'default',
                      '&:hover': {
                        backgroundColor: sku.alert_level === 'red' ? 'action.hover' : 'inherit'
                      }
                    }}
                  >
                    <TableCell>{sku.sku_name}</TableCell>
                    <TableCell 
                      align="center"
                      sx={{
                        color: sku.alert_level === 'red' ? '#D32F2F' : 'inherit',
                        fontWeight: 'bold'
                      }}
                    >
                      {`${sku.instock_rate}%`}
                    </TableCell>
                    <TableCell 
                      align="center"
                      sx={{
                        color: sku.alert_level === 'red' ? '#D32F2F' : 'inherit',
                        fontWeight: 'bold'
                      }}
                    >
                      {sku.days_of_cover}
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        sx={{
                          color: sku.alert_level === 'red' ? '#D32F2F' : 'inherit',
                          fontWeight: 'bold',
                          textTransform: sku.alert_level === 'none' || !sku.alert_level ? 'none' : 'uppercase'
                        }}
                      >
                        {sku.alert_level === 'none' || !sku.alert_level ? 'Green' : sku.alert_level}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  )
}

export default Pulse