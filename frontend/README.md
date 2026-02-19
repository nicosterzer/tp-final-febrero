# Frontend - Rutinas de Gimnasio

Aplicación web desarrollada con React y Vite para gestionar rutinas de entrenamiento: listar, buscar, crear, editar y eliminar rutinas y sus ejercicios por día de la semana.

## Descripción del proyecto

Interfaz de usuario que consume la API REST del backend de Rutinas de Gimnasio. Permite ver todas las rutinas, buscar por nombre en tiempo real, crear y editar rutinas con múltiples ejercicios organizados por día (Lunes a Domingo), y eliminar rutinas con confirmación.

## Requisitos previos

- **Node.js 18** o superior (recomendado 20 LTS)
- **npm** o **yarn**

## Instalación

Instalar dependencias:

```bash
npm install
```

## Configuración

### URL del backend

La aplicación llama a la API en:

- **Desarrollo**: con el proxy de Vite, las peticiones a `/api` se reenvían a `http://localhost:8000`. No hace falta configurar nada si el backend corre en ese puerto.
- **Producción**: indicar la URL base del backend con la variable de entorno `VITE_API_URL`.

Crear un archivo `.env` en la raíz del frontend (opcional en desarrollo):

```env
# URL base del backend (solo necesario si el backend no está en localhost:8000)
VITE_API_URL=http://localhost:8000
```

Para producción, usar la URL real del servidor, por ejemplo:

```env
VITE_API_URL=https://mi-api.com
```

## Ejecución

- **Modo desarrollo** (con recarga en caliente):

  ```bash
  npm run dev
  ```

  La aplicación corre en **http://localhost:5173**. Asegurarse de que el backend esté levantado en el puerto 8000 (o configurar el proxy en `vite.config.js`).

- **Compilar para producción**:

  ```bash
  npm run build
  ```

  Los archivos quedan en la carpeta `dist/`.

- **Previsualizar build de producción**:

  ```bash
  npm run preview
  ```

## Tecnologías utilizadas

- **React 18** – interfaz y componentes
- **Vite** – herramienta de build y servidor de desarrollo
- **React Router DOM** – rutas (listado, detalle, crear, editar)
- **Material UI (MUI)** – componentes y estilos
- **Axios** – peticiones HTTP a la API
- **Emotion** – estilos usados por MUI

## Estructura del proyecto

```
frontend/
├── public/
├── src/
│   ├── api/
│   │   └── rutinas.js      # Cliente HTTP (axios) y constantes
│   ├── components/
│   │   ├── Layout.jsx      # Barra de navegación y contenedor
│   │   ├── RutinaCard.jsx  # Tarjeta de rutina en el listado
│   │   ├── EjercicioItem.jsx # Línea de ejercicio en detalle
│   │   └── ConfirmDialog.jsx # Diálogo de confirmación (ej. eliminar)
│   ├── context/
│   │   └── SnackbarContext.jsx # Mensajes toast
│   ├── pages/
│   │   ├── RutinaList.jsx  # Listado y búsqueda
│   │   ├── RutinaDetail.jsx # Detalle de una rutina por día
│   │   └── RutinaForm.jsx  # Formulario crear/editar rutina y ejercicios
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── package.json
└── README.md
```
