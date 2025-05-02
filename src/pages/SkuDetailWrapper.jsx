import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import SkuDetail from './SkuDetail'

const SkuDetailWrapper = () => {
  const { sku } = useParams()
  const [data, setData] = useState([])
  const API_BASE = process.env.REACT_APP_API_BASE;

  useEffect(() => {
    fetch(`${API_BASE}/get_inventory_trend/${sku}`)
      .then(res => res.json())
      .then(json => {
        if (json.error) {
          setData([])
          return
        }

        const chartData = json.days.map((day, i) => ({
          day,
          inventory: json.inventory[i],
          fulfilled: json.fulfilled[i],
          unfulfilled: json.unfulfilled[i],
          mean_demand: json.mean_demand
        }))

        setData(chartData)
      })
      .catch(err => {
        console.error('Error fetching SKU data:', err)
        setData([])
      })
  }, [sku])

  return <SkuDetail sku={sku} data={data} />
}

export default SkuDetailWrapper