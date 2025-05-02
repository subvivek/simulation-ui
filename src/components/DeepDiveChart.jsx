import { Box, Typography } from '@mui/material'
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'

const DeepDiveChart = ({ title, data }) => {
  return (
    <Box
      flex="1"
      p="20px"
      borderRadius="8px"
      bgcolor="background.paper"
      boxShadow={3}
      minWidth="300px"
      maxWidth="800px"
      height="500px"
    >
      <Typography variant="h6" mb="10px">
        {title}
      </Typography>

      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="inventory"
            stroke="teal"
            strokeWidth={2}
            dot={false}
          />

          <Bar
            dataKey="fulfilled"
            stackId="demand"
            fill="green"
          />

          <Bar
            dataKey="unfulfilled"
            stackId="demand"
            fill="red"
          />

          <Line
            type="monotone"
            dataKey="mean_demand"
            stroke="magenta"
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  )
}

export default DeepDiveChart
