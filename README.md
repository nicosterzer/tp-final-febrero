# Backend - API Gestión de Rutinas de Gimnasio

API REST desarrollada con FastAPI para crear, listar, buscar, modificar y eliminar rutinas de entrenamiento y sus ejercicios.

## Requisitos previos

- **Python 3.10 o superior**
- **PostgreSQL**
- Opcional: entorno virtual (recomendado)

## Instalación

1. Crear y activar un entorno virtual:

   ```bash
   python -m venv venv
   ```

   - En Windows: `venv\Scripts\activate`
     *(Nota: Si PowerShell bloquea la ejecución, usa: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process`)*
   - En Linux/macOS: `source venv/bin/activate`

2. Instalar dependencias:

   ```bash
   pip install -r requirements.txt
   ```

## Configuración de la Base de Datos

### String de conexión

La aplicación se conecta a la base de datos mediante la variable de entorno `DATABASE_URL`.

**Formato del string de conexión (PostgreSQL):**

```
postgresql://USUARIO:CONTRASEÑA@HOST:PUERTO/NOMBRE_BD
```

- **USUARIO**: usuario de PostgreSQL
- **CONTRASEÑA**: contraseña del usuario
- **HOST**: normalmente `localhost` o `127.0.0.1`
- **PUERTO**: por defecto `5432`
- **NOMBRE_BD**: nombre de la base de datos (por ejemplo `gym_rutinas`)

### Variables de entorno

Crear un archivo `.env` en la raíz del backend (junto a `requirements.txt`). Puedes copiar `.env.example`:

```bash
cp .env.example .env
```

Ejemplo de `.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gym_rutinas
```

Ajusta usuario, contraseña, host, puerto y nombre de la base de datos según tu instalación de PostgreSQL.

### Crear la base de datos

En PostgreSQL (psql o pgAdmin), crear la base de datos si no existe:

```sql
CREATE DATABASE gym_rutinas;
```

### Migraciones

El proyecto no usa un sistema de migraciones externo. Las tablas se crean automáticamente al iniciar la aplicación (FastAPI lifespan). Si ya existe la base de datos y el `DATABASE_URL` es correcto, no hace falta ejecutar scripts adicionales.

## Ejecución

Iniciar el servidor:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- La aplicación corre en **http://localhost:8000**
- Documentación interactiva (Swagger): **http://localhost:8000/docs**
- Documentación alternativa (ReDoc): **http://localhost:8000/redoc**

## Endpoints disponibles

| Método | Ruta                               | Descripción                                       |
|--------|------------------------------------|---------------------------------------------------|
| GET    | `/api/rutinas`                     | Listar todas las rutinas                          |
| GET    | `/api/rutinas/buscar?nombre=texto` | Buscar rutinas por nombre (parcial)               |
| GET    | `/api/rutinas/{id}`                | Obtener detalle de una rutina con ejercicios      |
| POST   | `/api/rutinas`                     | Crear una nueva rutina (puede incluir ejercicios) |
| PUT    | `/api/rutinas/{id}`                | Actualizar una rutina                             |
| DELETE | `/api/rutinas/{id}`                | Eliminar una rutina (y sus ejercicios)            |
| POST   | `/api/rutinas/{id}/ejercicios`     | Agregar ejercicio a una rutina                    |
| PUT    | `/api/ejercicios/{id}`             | Actualizar un ejercicio                           |
| DELETE | `/api/ejercicios/{id}`             | Eliminar un ejercicio                             |

## Estructura del proyecto

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # Aplicación FastAPI, CORS, lifespan
│   ├── config.py        # Configuración (Settings desde .env)
│   ├── database.py      # Motor SQLModel y sesión
│   ├── models/          # Modelos de base de datos (Rutina, Ejercicio)
│   ├── schemas/         # Schemas Pydantic (request/response)
│   └── routers/         # Rutas (rutinas, ejercicios)
├── .env.example
├── requirements.txt
└── README.md
```
