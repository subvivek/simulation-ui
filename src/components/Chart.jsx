import { Box, Typography } from '@mui/material'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Legend,
} from 'recharts'

const Chart = ({
  title,
  data,
  type,
  color,
  lines, // NEW: array of { key, label, color }
  yAxisDomain = ['auto', 'auto'],
  yAxisTickFormatter,
  referenceLineY,
  referenceLineLabel,
}) => {
  const renderLines = () => {
    return lines.map((line, idx) => (
      <Line
        key={idx}
        type="monotone"
        dataKey={line.key}
        stroke={line.color}
        strokeWidth={2}
        name={line.label}
      />
    ))
  }

  return (
    <Box
      flex="1"
      p="20px"
      borderRadius="8px"
      bgcolor="background.paper"
      boxShadow={3}
      minWidth="300px"
      height="400px"
    >
      <Typography variant="h6" mb="10px">
        {title}
      </Typography>

      <ResponsiveContainer width="100%" height="90%">
        {type === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="day" />
            <YAxis domain={yAxisDomain} tickFormatter={yAxisTickFormatter} />
            <Tooltip
              formatter={(value) =>
                yAxisTickFormatter ? yAxisTickFormatter(value) : value
              }
            />
            {referenceLineY !== undefined && (
              <ReferenceLine
                y={referenceLineY}
                stroke="green"
                strokeDasharray="4 4"
                label={{
                  value: referenceLineLabel || `Goal: ${(referenceLineY * 100).toFixed(0)}%`,
                  position: 'center',
                  fill: 'white',
                  fontSize: 12,
                  fontWeight: 'bold',
                }}
              />
            )}
            {lines ? renderLines() : (
              <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} />
            )}
            {lines && <Legend />}
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="day" />
            <YAxis domain={yAxisDomain} tickFormatter={yAxisTickFormatter} />
            <Tooltip
              formatter={(value) =>
                yAxisTickFormatter ? yAxisTickFormatter(value) : value
              }
            />
            <Bar dataKey="value" fill={color} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </Box>
  )
}

export default Chart
