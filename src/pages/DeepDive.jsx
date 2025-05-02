import { Box, Typography, TextField, MenuItem, Button, Autocomplete } from '@mui/material'
import { useEffect, useState } from 'react'
import DeepDiveChart from '../components/DeepDiveChart'
import VendorPerformance from '../components/VendorPerformance'
import AskDobby from '../components/AskDobby'

const DeepDive = ({ alertSkus = [], setSelectedLevel = () => {}, setAlertSkus = () => {}, onSkuClick = () => {} }) => {
  const [skuList, setSkuList] = useState([])
  const [selectedSku, setSelectedSku] = useState('')
  const [minDay, setMinDay] = useState(1)
  const [maxDay, setMaxDay] = useState(30)
  const [fromDay, setFromDay] = useState(1)
  const [toDay, setToDay] = useState(30)
  const [chartData, setChartData] = useState(null)
  const [vendorData, setVendorData] = useState(null)
  const API_BASE = process.env.REACT_APP_API_BASE;

  useEffect(() => {
    fetch(`${API_BASE}/sku-list`)
      .then((res) => res.json())
      .then((data) => {
        setSkuList(data.skus)
        setSelectedSku(data.skus[0] || '')
      })
      .catch(() => setSkuList([]))

    fetch(`${API_BASE}/simulation-range`)
      .then((res) => res.json())
      .then((data) => {
        setMinDay(data.minDay)
        setMaxDay(data.maxDay)
        setFromDay(data.minDay)
        setToDay(data.maxDay)
      })
      .catch(() => {
        setMinDay(1)
        setMaxDay(30)
        setFromDay(1)
        setToDay(30)
      })
  }, [])
  
  useEffect(() => {
    if (!alertSkus || alertSkus.length === 0) {
      fetch(`${API_BASE}/alerts/skus?level=all`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.length > 0) setAlertSkus(data)
        })
        .catch((err) => console.error('Failed to load alert SKUs in DeepDive:', err))
    }
  }, [alertSkus, setAlertSkus])
  
  // Fetch vendor data when SKU changes
  useEffect(() => {
    if (!selectedSku) return

    fetch(`${API_BASE}/vendor-performance/${selectedSku}`)
      .then((res) => res.json())
      .then((data) => setVendorData(data))
      .catch(() => setVendorData(null))
  }, [selectedSku])

  const handleSearch = () => {
    if (!selectedSku) return

    fetch(`${API_BASE}/get_inventory_trend/${selectedSku}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API returned status ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        const filterIndex = data.days
          .map((day, idx) => (day >= fromDay && day <= toDay ? idx : -1))
          .filter((idx) => idx !== -1)
      
        const preparedData = filterIndex.map((i) => ({
          day: data.days[i],
          inventory: data.inventory[i],
          fulfilled: data.fulfilled[i],
          unfulfilled: data.unfulfilled[i],
          mean_demand: data.mean_demand[i],
        }))
      
        setChartData(preparedData)
      })
      .catch((err) => {
        console.error("Failed to load trend data:", err)
        alert("Failed to load data. Check SKU selection or time range.")
      })
  }

  return (
    <Box m="20px">
      <Typography variant="h3" fontWeight="bold" mb="20px">
        Deep Dive
      </Typography>
      
      <Box display="flex" gap="20px" mb="20px" flexWrap="wrap">
        <Autocomplete
          options={skuList}
          value={selectedSku}
          onChange={(event, newValue) => setSelectedSku(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select SKU"
              placeholder="Search SKU..."
              variant="outlined"
              size="small"
              sx={{
                minWidth: 200,
                height: 40,
                '& .MuiInputBase-root': { height: 40, boxSizing: 'border-box' }
              }}
            />
          )}
          size="small"
          sx={{
            minWidth: 200,
            height: 40,
            '& .MuiInputBase-root': { height: 40, boxSizing: 'border-box' }
          }}
          isOptionEqualToValue={(option, value) => option === value}
        />

        <TextField
          label="From Day"
          type="number"
          value={fromDay}
          onChange={(e) => setFromDay(Number(e.target.value))}
          inputProps={{ min: minDay, max: maxDay }}
          size="small"
          sx={{
            height: 40,
            '& .MuiInputBase-root': { height: 40, boxSizing: 'border-box' }
          }}
        />

        <TextField
          label="To Day"
          type="number"
          value={toDay}
          onChange={(e) => setToDay(Number(e.target.value))}
          inputProps={{ min: minDay, max: maxDay }}
          size="small"
          sx={{
            height: 40,
            '& .MuiInputBase-root': { height: 40, boxSizing: 'border-box' }
          }}
        />

        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </Box>
      
      {selectedSku && alertSkus?.some(alert => alert.sku_id === selectedSku) && (
        <Box
          mb={2}
          p={2}
          bgcolor="background.paper"
          borderLeft="6px solid #ffa726"  // subtle amber border
          borderRadius={1}
          boxShadow={0}
        >
          <Typography variant="body1" fontWeight="bold" color="warning.main">
            ⚠️ This SKU has a stockout alert.
            <span
              onClick={() => {
                setSelectedLevel('red'); // or actual alert level if available
                setAlertSkus(alertSkus);
                onSkuClick(selectedSku);
              }}
              style={{ marginLeft: 8, cursor: 'pointer', textDecoration: 'underline', color: '#1976d2' }}
            >
              View in Alerts Sidebar
            </span>
          </Typography>
        </Box>
      )}


      <Box display="flex" gap="20px" flexWrap="wrap" width="100%">
        <Box flex="1" minWidth="600px">
          {chartData ? (
            <DeepDiveChart
              title={`Inventory & Demand Trend for ${selectedSku}`}
              data={chartData}
            />
          ) : (
            <Typography variant="h6" color="text.secondary">
              Select filters and click Search to see results
            </Typography>
          )}
        </Box>

        <Box flex="1" minWidth="400px">
          {chartData && vendorData && vendorData.purchase_orders?.length > 0 && (
            <VendorPerformance
              vendorId={vendorData.vendor_id}
              purchaseOrders={vendorData.purchase_orders}
              avgDelay={vendorData.average_delay}
              avgFillRate={vendorData.average_fill_rate}
            />
          )}
        </Box>
      </Box>

      {/* Ask Dobby chatbot (bottom-right floating) */}
      {selectedSku && <AskDobby sku={selectedSku} />}
    </Box>
  )
}

export default DeepDive