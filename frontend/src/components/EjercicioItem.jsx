import { ListItem, ListItemText, Typography, Chip } from '@mui/material'

export default function EjercicioItem({ ejercicio }) {
  const pesoText = ejercicio.peso != null ? ` • ${ejercicio.peso} kg` : ''
  const primary = `${ejercicio.nombre} — ${ejercicio.series} × ${ejercicio.repeticiones}${pesoText}`

  return (
    <ListItem alignItems="flex-start" sx={{ py: 0.5 }}>
      <ListItemText
        primary={primary}
        secondary={
          ejercicio.notas ? (
            <Typography component="span" variant="body2" color="text.secondary">
              {ejercicio.notas}
            </Typography>
          ) : null
        }
      />
      <Chip label={ejercicio.dia_semana} size="small" sx={{ ml: 1 }} variant="outlined" />
    </ListItem>
  )
}
