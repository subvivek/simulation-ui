import React from 'react'
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material'

const VendorPerformance = ({ vendorId, purchaseOrders = [], avgDelay, avgFillRate }) => {
  return (
    <Box p={2} height="100%" overflow="auto">
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        📦 Vendor Performance {vendorId && `(${vendorId})`}
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><b>Order Day</b></TableCell>
            <TableCell><b>Received Day</b></TableCell>
            <TableCell><b>Ordered Units</b></TableCell>
            <TableCell><b>Days Delayed</b></TableCell>
            <TableCell><b>Fill Rate (%)</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {purchaseOrders.map((po, idx) => (
            <TableRow key={idx}>
              <TableCell>{po.order_day}</TableCell>
              <TableCell>{po.received_day}</TableCell>
              <TableCell>{po.ordered_units}</TableCell>
              <TableCell>{po.days_delayed}</TableCell>
              <TableCell>{po.fill_rate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box mt={2}>
        <Typography variant="body2">
          <strong>Average Delay:</strong> {avgDelay ?? 'N/A'} days
        </Typography>
        <Typography variant="body2">
          <strong>Average Fill Rate:</strong> {avgFillRate ?? 'N/A'}%
        </Typography>
      </Box>
    </Box>
  )
}

export default VendorPerformance
