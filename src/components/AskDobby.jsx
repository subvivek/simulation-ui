import { useState, useEffect, useRef } from 'react'
import {
  Box,
  IconButton,
  TextField,
  Typography,
  CircularProgress,
  Paper
} from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'

const AskDobby = ({ sku = null }) => {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [simulationDay, setSimulationDay] = useState(null)
  const [hasOpenedBefore, setHasOpenedBefore] = useState(false)
  const chatEndRef = useRef(null)

  const toggleChat = () => {
    const willOpen = !open
    setOpen(willOpen)

    if (willOpen && !hasOpenedBefore) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'dobby',
          text: "Hi! I'm Dobby 🧦 — your supply chain assistant. Ask me anything about this SKU!"
        }
      ])
      setHasOpenedBefore(true)
    }
  }

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/simulation-range')
      .then(res => res.json())
      .then(data => setSimulationDay(data.maxDay))
      .catch(() => setSimulationDay(30))
  }, [])

  const handleSend = async () => {
    if (!question.trim()) return

    const userMessage = { sender: 'user', text: question }
    setMessages(prev => [...prev, userMessage])
    setQuestion('')
    setLoading(true)

    try {
      const res = await fetch('http://127.0.0.1:5000/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, sku, day: simulationDay })
      })
      const data = await res.json()
      const botMessage = {
        sender: 'dobby',
        text: data.answer || 'No response from Dobby.'
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'dobby', text: 'Something went wrong. Dobby is sorry 🧦' }])
    }

    setLoading(false)
  }

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, loading])

  return (
    <Box position="fixed" bottom={20} right={20} zIndex={9999}>
      {open ? (
        <Paper
          elevation={6}
          sx={{
            width: 400,
            height: 600,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            backgroundColor: '#1E1E2F',
            color: '#E4E4EB',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={2}
            py={1}
            bgcolor="#161623"
          >
            <Typography fontWeight="bold">🤖 Ask Dobby</Typography>
            <IconButton size="small" onClick={toggleChat} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Chat content */}
          <Box
            flex={1}
            px={2}
            py={1}
            sx={{
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: '#1E1E2F'
            }}
          >
            {messages.map((msg, idx) => (
              <Box
                key={idx}
                alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
                bgcolor={msg.sender === 'user' ? '#4C5A88' : '#2C2C3E'}
                color="#E4E4EB"
                px={2}
                py={1}
                borderRadius={2}
                mb={1}
                maxWidth="80%"
              >
                {msg.text}
              </Box>
            ))}
            {loading && <CircularProgress size={18} sx={{ alignSelf: 'center', mt: 1 }} />}
            <div ref={chatEndRef} />
          </Box>

          {/* Input */}
          <Box display="flex" gap={1} p={2} borderTop="1px solid #2C2C3E">
            <TextField
              variant="filled"
              size="small"
              fullWidth
              placeholder="Ask something..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              sx={{
                input: {
                  backgroundColor: '#29293D',
                  color: '#E4E4EB'
                },
                '& .MuiFilledInput-root': {
                  backgroundColor: '#29293D'
                }
              }}
            />
            <IconButton onClick={handleSend} sx={{ color: '#E4E4EB' }}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      ) : (
        <IconButton
          size="large"
          onClick={toggleChat}
          sx={{
            bgcolor: '#5961A1',
            color: 'white',
            boxShadow: 4,
            '&:hover': { bgcolor: '#4C5A88' }
          }}
        >
          <ChatIcon fontSize="medium" />
        </IconButton>
      )}
    </Box>
  )
}

export default AskDobby
