import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Typography,
  Paper,
  Box,
  Button,
  List,
  CircularProgress,
  Alert,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { getRutinaById, deleteRutina } from '../api/rutinas'
import EjercicioItem from '../components/EjercicioItem'
import ConfirmDialog from '../components/ConfirmDialog'
import { useSnackbar } from '../context/SnackbarContext'

const DIAS_ORDEN = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

function groupByDay(ejercicios) {
  const byDay = {}
  DIAS_ORDEN.forEach((d) => (byDay[d] = []))
    ; (ejercicios || []).forEach((e) => {
      const day = e.dia_semana
      if (!byDay[day]) byDay[day] = []
      byDay[day].push(e)
    })
  return byDay
}

export default function RutinaDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [rutina, setRutina] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const showSnackbar = useSnackbar()

  useEffect(() => {
    let cancelled = false
    getRutinaById(id)
      .then((data) => {
        if (!cancelled) setRutina(data)
      })
      .catch((e) => {
        if (!cancelled) setError(e.response?.data?.detail || e.message || 'Error al cargar')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => (cancelled = true)
  }, [id])

  const handleDelete = async () => {
    try {
      await deleteRutina(id)
      showSnackbar('Rutina eliminada', 'success')
      navigate('/')
    } catch (e) {
      showSnackbar(e.response?.data?.detail || 'Error al eliminar', 'error')
    }
    setConfirmDelete(false)
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    )
  }
  if (error || !rutina) {
    return (
      <Alert severity="error" onClose={() => navigate('/')}>
        {error || 'Rutina no encontrada'}
      </Alert>
    )
  }

  const byDay = groupByDay(rutina.ejercicios)
  const diasConEjercicios = DIAS_ORDEN.filter((d) => byDay[d].length > 0)

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1} mb={2}>
        <Typography variant="h4">{rutina.nombre}</Typography>
        <Box>
          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/rutinas/${id}/editar`)} sx={{ mr: 1 }}>
            Editar
          </Button>
          <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => setConfirmDelete(true)}>
            Eliminar
          </Button>
        </Box>
      </Box>
      {rutina.descripcion && (
        <Typography color="text.secondary" paragraph>
          {rutina.descripcion}
        </Typography>
      )}
      <Typography variant="caption" color="text.secondary" display="block" mb={2}>
        Creada: {new Date(rutina.fecha_creacion).toLocaleString('es-AR')}
      </Typography>

      {diasConEjercicios.length === 0 ? (
        <Alert severity="info">Esta rutina no tiene ejercicios cargados. Podés agregarlos editando la rutina.</Alert>
      ) : (
        diasConEjercicios.map((dia) => (
          <Paper key={dia} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              {dia}
            </Typography>
            <List dense disablePadding>
              {byDay[dia].map((ej) => (
                <EjercicioItem key={ej.id} ejercicio={ej} />
              ))}
            </List>
          </Paper>
        ))
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Eliminar rutina"
        message={`¿Eliminar "${rutina.nombre}"? Se eliminarán todos sus ejercicios.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </Box>
  )
}
