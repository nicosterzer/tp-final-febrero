import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { getRutinaById, createRutina, updateRutina } from '../api/rutinas'
import { DIAS_SEMANA } from '../api/rutinas'
import { useSnackbar } from '../context/SnackbarContext'

// Helper para generar la estructura inicial de un ejercicio nuevo
const emptyEjercicio = () => ({
  nombre: '',
  dia_semana: 'Lunes',
  series: 3,
  repeticiones: 10,
  peso: null,
  notas: '',
  orden: 0,
})

export default function RutinaForm() {
  // Obtiene el parámetro 'id' de la URL (si existe) para saber qué rutina editar
  const { id } = useParams()
  const navigate = useNavigate()
  // Determina si estamos en modo "Edición" (hay ID) o "Creación" (no hay ID)
  const isEdit = Boolean(id)

  // Estados locales para manejar los inputs del formulario
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  // Estado para la lista dinámica de ejercicios
  const [ejercicios, setEjercicios] = useState([emptyEjercicio()])
  
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const showSnackbar = useSnackbar()

  // Efecto: Si es modo edición, carga los datos de la rutina desde la API al montar el componente
  useEffect(() => {
    if (!isEdit) return
    getRutinaById(id)
      .then((data) => {
        setNombre(data.nombre)
        setDescripcion(data.descripcion || '')
        if (data.ejercicios?.length) {
          setEjercicios(
            data.ejercicios.map((e) => ({
              nombre: e.nombre,
              dia_semana: e.dia_semana,
              series: e.series,
              repeticiones: e.repeticiones,
              peso: e.peso ?? null,
              notas: e.notas || '',
              orden: e.orden ?? 0,
            }))
          )
        } else {
          setEjercicios([emptyEjercicio()])
        }
      })
      .catch((e) => setError(e.response?.data?.detail || e.message || 'Error al cargar'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  // Agrega un nuevo objeto de ejercicio vacío al final del array de estado
  const addEjercicio = () => setEjercicios((prev) => [...prev, emptyEjercicio()])

  // Elimina un ejercicio del array basado en su índice visual
  const removeEjercicio = (index) => {
    if (ejercicios.length <= 1) return
    setEjercicios((prev) => prev.filter((_, i) => i !== index))
  }

  // Actualiza un campo específico (nombre, series, etc.) de un ejercicio específico
  const updateEjercicio = (index, field, value) => {
    setEjercicios((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value === '' && (field === 'peso' || field === 'notas') ? (field === 'peso' ? null : '') : value }
      return next
    })
  }

  // Validaciones del lado del cliente para asegurar integridad básica antes de llamar a la API
  const validate = () => {
    if (!nombre.trim()) {
      showSnackbar('El nombre de la rutina es obligatorio', 'error')
      return false
    }
    for (let i = 0; i < ejercicios.length; i++) {
      const e = ejercicios[i]
      if (!e.nombre.trim()) {
        showSnackbar(`Ejercicio ${i + 1}: el nombre es obligatorio`, 'error')
        return false
      }
      if (!e.series || e.series < 1) {
        showSnackbar(`Ejercicio ${i + 1}: series debe ser mayor a 0`, 'error')
        return false
      }
      if (!e.repeticiones || e.repeticiones < 1) {
        showSnackbar(`Ejercicio ${i + 1}: repeticiones debe ser mayor a 0`, 'error')
        return false
      }
      if (e.peso != null && e.peso !== '' && (Number(e.peso) <= 0 || isNaN(Number(e.peso)))) {
        showSnackbar(`Ejercicio ${i + 1}: el peso debe ser un número positivo`, 'error')
        return false
      }
    }
    return true
  }

  // Construye el objeto JSON final limpiando espacios y convirtiendo tipos (strings a números)
  const buildPayload = () => ({
    nombre: nombre.trim(),
    descripcion: descripcion.trim() || null,
    ejercicios: ejercicios
      .filter((e) => e.nombre.trim())
      .map((e, i) => ({
        nombre: e.nombre.trim(),
        dia_semana: e.dia_semana,
        series: Number(e.series),
        repeticiones: Number(e.repeticiones),
        peso: e.peso !== '' && e.peso != null ? Number(e.peso) : null,
        notas: e.notas?.trim() || null,
        orden: i,
      })),
  })

  // Maneja el evento de envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    setError(null)
    try {
      const payload = buildPayload()
      // Decide si llamar a la API de actualización o de creación
      if (isEdit) {
        await updateRutina(id, payload)
        showSnackbar('Rutina actualizada correctamente', 'success')
        navigate(`/rutinas/${id}`)
      } else {
        const created = await createRutina(payload)
        showSnackbar('Rutina creada correctamente', 'success')
        navigate(`/rutinas/${created.id}`)
      }
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Error al guardar'
      setError(Array.isArray(msg) ? msg.map((m) => m.msg || m).join(', ') : msg)
      showSnackbar(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h4" gutterBottom>
        {isEdit ? 'Editar rutina' : 'Nueva rutina'}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre de la rutina"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción (opcional)"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h6" gutterBottom>
        Ejercicios
      </Typography>
      {ejercicios.map((ej, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                label="Nombre del ejercicio"
                value={ej.nombre}
                onChange={(e) => updateEjercicio(index, 'nombre', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Día</InputLabel>
                <Select
                  value={ej.dia_semana}
                  label="Día"
                  onChange={(e) => updateEjercicio(index, 'dia_semana', e.target.value)}
                >
                  {DIAS_SEMANA.map((d) => (
                    <MenuItem key={d} value={d}>{d}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={1}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Series"
                value={ej.series}
                onChange={(e) => updateEjercicio(index, 'series', e.target.value)}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={6} md={1}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Reps"
                value={ej.repeticiones}
                onChange={(e) => updateEjercicio(index, 'repeticiones', e.target.value)}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={6} md={1}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Peso (kg)"
                value={ej.peso ?? ''}
                onChange={(e) => updateEjercicio(index, 'peso', e.target.value)}
                inputProps={{ min: 0, step: 0.5 }}
                placeholder="—"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Notas"
                value={ej.notas}
                onChange={(e) => updateEjercicio(index, 'notas', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <IconButton color="error" onClick={() => removeEjercicio(index)} disabled={ejercicios.length <= 1} title="Quitar ejercicio">
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      ))}
      <Button variant="outlined" startIcon={<AddIcon />} onClick={addEjercicio} sx={{ mb: 2 }}>
        Agregar ejercicio
      </Button>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button type="submit" variant="contained" disabled={saving}>
          {saving ? <CircularProgress size={24} /> : isEdit ? 'Guardar cambios' : 'Crear rutina'}
        </Button>
        <Button variant="outlined" onClick={() => navigate(isEdit ? `/rutinas/${id}` : '/')}>
          Cancelar
        </Button>
      </Box>
    </Box>
  )
}
