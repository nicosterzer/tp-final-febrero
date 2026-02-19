import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

export { DIAS_SEMANA }

/**
 * Obtiene todas las rutinas disponibles.
 * @returns {Promise<Array>} Lista de rutinas.
 */
export async function getRutinas() {
  const { data } = await api.get('/api/rutinas')
  return data
}

/**
 * Obtiene una rutina específica por su ID.
 * @param {string|number} id - ID de la rutina.
 * @returns {Promise<Object>} Objeto de la rutina.
 */
export async function getRutinaById(id) {
  const { data } = await api.get(`/api/rutinas/${id}`)
  return data
}

/**
 * Busca rutinas por nombre. Si el nombre está vacío, devuelve todas.
 * @param {string} nombre - Nombre a buscar.
 * @returns {Promise<Array>} Lista de rutinas encontradas.
 */
export async function buscarRutinas(nombre) {
  if (!nombre?.trim()) return getRutinas()
  const { data } = await api.get('/api/rutinas/buscar', { params: { nombre: nombre.trim() } })
  return data
}

/**
 * Crea una nueva rutina.
 * @param {Object} payload - Datos de la rutina.
 * @returns {Promise<Object>} La rutina creada.
 */
export async function createRutina(payload) {
  const { data } = await api.post('/api/rutinas', payload)
  return data
}

/**
 * Actualiza una rutina existente.
 * @param {string|number} id - ID de la rutina.
 * @param {Object} payload - Datos a actualizar.
 * @returns {Promise<Object>} La rutina actualizada.
 */
export async function updateRutina(id, payload) {
  const { data } = await api.put(`/api/rutinas/${id}`, payload)
  return data
}

/**
 * Elimina una rutina por su ID.
 * @param {string|number} id - ID de la rutina.
 */
export async function deleteRutina(id) {
  await api.delete(`/api/rutinas/${id}`)
}

/**
 * Agrega un ejercicio a una rutina específica.
 * @param {string|number} rutinaId - ID de la rutina.
 * @param {Object} ejercicio - Datos del ejercicio.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export async function addEjercicio(rutinaId, ejercicio) {
  const { data } = await api.post(`/api/rutinas/${rutinaId}/ejercicios`, ejercicio)
  return data
}

/**
 * Actualiza un ejercicio existente.
 * @param {string|number} id - ID del ejercicio.
 * @param {Object} ejercicio - Datos actualizados del ejercicio.
 * @returns {Promise<Object>} El ejercicio actualizado.
 */
export async function updateEjercicio(id, ejercicio) {
  const { data } = await api.put(`/api/ejercicios/${id}`, ejercicio)
  return data
}

/**
 * Elimina un ejercicio por su ID.
 * @param {string|number} id - ID del ejercicio.
 */
export async function deleteEjercicio(id) {
  await api.delete(`/api/ejercicios/${id}`)
}
