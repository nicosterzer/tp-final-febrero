import { Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import Layout from './components/Layout'
import RutinaList from './pages/RutinaList'
import RutinaDetail from './pages/RutinaDetail'
import RutinaForm from './pages/RutinaForm'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path="/" element={<RutinaList />} />
          <Route path="/rutinas/nueva" element={<RutinaForm />} />
          <Route path="/rutinas/:id" element={<RutinaDetail />} />
          <Route path="/rutinas/:id/editar" element={<RutinaForm />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  )
}

export default App
