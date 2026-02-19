import { Card, CardContent, CardActions, Typography, Button } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'

export default function RutinaCard({ rutina, onDelete }) {
  const fecha = rutina.fecha_creacion
    ? new Date(rutina.fecha_creacion).toLocaleDateString('es-AR')
    : ''

  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {rutina.nombre}
        </Typography>
        {rutina.descripcion && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {rutina.descripcion}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary">
          Creada: {fecha}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={RouterLink} to={`/rutinas/${rutina.id}`} startIcon={<VisibilityIcon />}>
          Ver
        </Button>
        <Button size="small" component={RouterLink} to={`/rutinas/${rutina.id}/editar`} startIcon={<EditIcon />}>
          Editar
        </Button>
        {onDelete && (
          <Button size="small" color="error" onClick={() => onDelete(rutina)}>
            Eliminar
          </Button>
        )}
      </CardActions>
    </Card>
  )
}
