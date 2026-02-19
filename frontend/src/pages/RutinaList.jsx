import { useState, useEffect, useCallback } from 'react'
import { Typography, TextField, Grid, Box, CircularProgress, Alert } from '@mui/material'
import { buscarRutinas, deleteRutina } from '../api/rutinas'
import RutinaCard from '../components/RutinaCard'
import ConfirmDialog from '../components/ConfirmDialog'
import { useSnackbar } from '../context/SnackbarContext'

let searchTimeout

export default function RutinaList() {
  const [rutinas, setRutinas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [rutinaToDelete, setRutinaToDelete] = useState(null)
  const showSnackbar = useSnackbar()

  const loadRutinas = useCallback(async (nombre = '') => {
    setLoading(true)
    setError(null)
    try {
      const data = await buscarRutinas(nombre)
      setRutinas(data)
    } catch (e) {
      setError(e.response?.data?.detail || e.message || 'Error al cargar rutinas')
      setRutinas([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => loadRutinas(busqueda), 300)
    return () => clearTimeout(searchTimeout)
  }, [busqueda, loadRutinas])

  const handleDeleteClick = (rutina) => setRutinaToDelete(rutina)

  const handleDeleteConfirm = async () => {
    if (!rutinaToDelete) return
    try {
      await deleteRutina(rutinaToDelete.id)
      setRutinas((prev) => prev.filter((r) => r.id !== rutinaToDelete.id))
      showSnackbar('Rutina eliminada correctamente', 'success')
    } catch (e) {
      showSnackbar(e.response?.data?.detail || 'Error al eliminar', 'error')
    } finally {
      setRutinaToDelete(null)
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Mis rutinas
      </Typography>
      <TextField
        fullWidth
        label="Buscar por nombre"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        sx={{ mb: 2 }}
        placeholder="Escribí para buscar en tiempo real..."
      />
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : rutinas.length === 0 ? (
        <Alert severity="info">
          {busqueda ? 'No hay rutinas que coincidan con la búsqueda.' : 'No hay rutinas. Creá una desde "Nueva rutina".'}
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {rutinas.map((r) => (
            <Grid item xs={12} sm={6} md={4} key={r.id}>
              <RutinaCard rutina={r} onDelete={handleDeleteClick} />
            </Grid>
          ))}
        </Grid>
      )}
      <ConfirmDialog
        open={!!rutinaToDelete}
        title="Eliminar rutina"
        message={rutinaToDelete ? `¿Eliminar la rutina "${rutinaToDelete.nombre}"? Se eliminarán también todos sus ejercicios.` : ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setRutinaToDelete(null)}
      />
    </Box>
  )
}
