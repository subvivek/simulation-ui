import { Box } from '@mui/material'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import HamburgerMenu from './components/HamburgerMenu'
import Pulse from './pages/Pulse'
import DeepDive from './pages/DeepDive'
import SkuDetailWrapper from './pages/SkuDetailWrapper'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

const AppContent = () => {
  const [alertSkus, setAlertSkus] = useState([])
  const [selectedLevel, setSelectedLevel] = useState('')
  const navigate = useNavigate()
  const [activeSku, setActiveSku] = useState('')
  const location = useLocation()

  const handleSkuClick = (sku) => {
    if (sku === null) {
      setAlertSkus([])
      setSelectedLevel('')
      setActiveSku('')
    } else {
      setActiveSku(sku)
      navigate(`/sku/${sku}`)
    }
  }  

  const handleBackToMenu = () => {
    setAlertSkus([])
    setSelectedLevel('')
    setActiveSku('')
    navigate('/')
  }

  return (
    <Box display="flex">
      {/* Show HamburgerMenu only when there are no alerts */}
      {!location.pathname.startsWith('/sku') && <HamburgerMenu />}
      
      {/* Show Sidebar only when there are alerts */}
      {alertSkus && alertSkus.length > 0 && location.pathname.startsWith('/sku') && (
        <Sidebar
          alertSkus={alertSkus}
          selectedLevel={selectedLevel}
          onSkuClick={handleSkuClick}
          onBackToMenu={handleBackToMenu}
          activeSku={activeSku}
        />
      )}
      
      <Box flexGrow={1}>
        <Topbar />
        <Routes>
          <Route
            path="/"
            element={
              <Pulse
                setAlertSkus={setAlertSkus}
                setSelectedLevel={setSelectedLevel}
                onSkuClick={handleSkuClick}
              />
            }
          />
          <Route
            path="/deep-dive"
            element={
              <DeepDive
                alertSkus={alertSkus}
                setAlertSkus={setAlertSkus}
                setSelectedLevel={setSelectedLevel}
                onSkuClick={handleSkuClick}
              />
            }
          />
          <Route path="/sku/:sku" element={<SkuDetailWrapper />} />
        </Routes>
      </Box>
    </Box>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App