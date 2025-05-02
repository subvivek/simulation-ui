import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import DeepDiveChart from '../components/DeepDiveChart'
import VendorPerformance from '../components/VendorPerformance'
import AskDobby from '../components/AskDobby'

const SkuDetail = ({ sku }) => {
  const [rootCause, setRootCause] = useState('Loading...')
  const [context, setContext] = useState(null)
  const [vendorData, setVendorData] = useState(null)
  const [simulationDay, setSimulationDay] = useState(null)
  const [range, setRange] = useState([1, 1])
  const [trendData, setTrendData] = useState(null)
  const [suggestedAction, setSuggestedAction] = useState('Loading...')
  const [isAutoResolved, setIsAutoResolved] = useState(false)

  // Fetch latest simulation day and metric lookback period
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/simulation-range')
      .then(res => res.json())
      .then(data => {
        setSimulationDay(data.maxDay)
        setRange([data.lookbackMin || data.minDay, data.maxDay])
      })
      .catch(() => {
        setSimulationDay(30)
        setRange([1, 30])
      })
  }, [])

  // Fetch root cause analysis
  useEffect(() => {
    if (!sku || !simulationDay) return

    setRootCause('Loading...')
    setSuggestedAction('Loading...')
    setContext(null)

    fetch('http://127.0.0.1:5000/api/sku-root-cause', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku, day: simulationDay })
    })
      .then((res) => res.json())
      .then((data) => {
        setRootCause(data.root_cause || 'No analysis available.')
        setSuggestedAction(data.suggested_action || 'No action available.')
        setIsAutoResolved(data.auto_action || false)
        setContext(data)
      })
      .catch(() => {
        setRootCause('Failed to load root cause.')
        setSuggestedAction('Failed to load suggested action.')
        setIsAutoResolved(false)
      })
  }, [sku, simulationDay])

  // Fetch vendor performance metrics
  useEffect(() => {
    if (!sku || !simulationDay) return

    setVendorData(null)

    fetch(`http://127.0.0.1:5000/api/vendor-performance/${sku}`)
      .then((res) => res.json())
      .then((data) => setVendorData(data))
      .catch(() => setVendorData(null))
  }, [sku, simulationDay])

  // Fetch inventory and demand trend
  useEffect(() => {
    if (!sku) return

    fetch(`http://127.0.0.1:5000/api/get_inventory_trend/${sku}`)
      .then((res) => res.json())
      .then((data) => setTrendData(data))
      .catch(() => setTrendData(null))
  }, [sku])

  return (
    <>
      <Box width="100%" height="100vh" display="flex" flexDirection="column">
        {/* Top 30% */}
        <Box flex="0 0 30%" display="flex" borderBottom="1px solid #ccc">
          {/* Call-out Block */}
          <Box flex="1" p={2} borderRight="1px solid #ccc" bgcolor="background.paper">
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              📣 Call-out
            </Typography>
            <Typography variant="body2" whiteSpace="pre-line">
              {rootCause}
            </Typography>
          </Box>

          {/* Suggested Action Block */}
          <Box flex="1" p={2} bgcolor="background.paper">
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {isAutoResolved ? "🤖 Action taken by Dobby" : "✅ Suggested Action"}
            </Typography>
            <Typography variant="body2">
              {suggestedAction}
            </Typography>
          </Box>
        </Box>

        {/* Bottom 70%: Inventory Chart + Vendor Performance */}
        <Box flex="1" p={2} display="flex" gap={2}>
          <Box flex={1}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              📊 Inventory Trend for {sku}
            </Typography>
            {trendData ? (
              <DeepDiveChart
                title={`SKU ${sku} Inventory & Demand`}
                data={trendData.days.map((day, idx) => ({
                  day,
                  inventory: trendData.inventory[idx],
                  fulfilled: trendData.fulfilled[idx],
                  unfulfilled: trendData.unfulfilled[idx],
                  mean_demand: trendData.mean_demand[idx],
                })).filter(d => d.day >= range[0] && d.day <= range[1])}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                Loading inventory trend...
              </Typography>
            )}
          </Box>

          <Box flex={1}>
            {vendorData && vendorData.purchase_orders?.length > 0 ? (
              <VendorPerformance
                vendorId={vendorData.vendor_id}
                purchaseOrders={vendorData.purchase_orders}
                avgDelay={vendorData.average_delay}
                avgFillRate={vendorData.average_fill_rate}
              />
            ) : (
              <Typography>No vendor data available.</Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Ask Dobby chatbot (bottom-right floating) */}
      <AskDobby sku={sku} />
    </>
  )
}

export default SkuDetail