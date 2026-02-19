from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import create_db_and_tables, get_session
from app.routers import rutinas, ejercicios


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Crear tablas al iniciar la aplicación."""
    create_db_and_tables()
    yield


app = FastAPI(
    title="API Gestión de Rutinas de Gimnasio",
    description="API REST para crear, listar, buscar, modificar y eliminar rutinas de entrenamiento.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rutinas.router, prefix=settings.API_PREFIX, tags=["Rutinas"])
app.include_router(ejercicios.router, prefix=settings.API_PREFIX, tags=["Ejercicios"])


@app.get("/")
def root():
    return {"message": "API de Rutinas de Gimnasio", "docs": "/docs"}
