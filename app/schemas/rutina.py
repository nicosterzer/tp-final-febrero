from datetime import datetime
from pydantic import BaseModel, Field

from app.schemas.ejercicio import EjercicioCreate, EjercicioReadSinRutina


class RutinaBase(BaseModel):
    """Schema base para rutina."""

    nombre: str = Field(..., min_length=1, max_length=200)
    descripcion: str | None = Field(default=None, max_length=1000)


class RutinaCreate(RutinaBase):
    """Schema para crear rutina (puede incluir ejercicios)."""

    ejercicios: list[EjercicioCreate] = Field(default_factory=list)


class RutinaUpdate(BaseModel):
    """Schema para actualizar rutina."""

    nombre: str | None = Field(default=None, min_length=1, max_length=200)
    descripcion: str | None = Field(default=None, max_length=1000)
    ejercicios: list[EjercicioCreate] | None = None  # Si se envía, reemplaza la lista


class RutinaRead(RutinaBase):
    """Schema de lectura resumida (sin ejercicios)."""

    id: int
    fecha_creacion: datetime


class RutinaReadConEjercicios(RutinaRead):
    """Schema de lectura con ejercicios ordenados por día y orden."""

    ejercicios: list[EjercicioReadSinRutina] = Field(default_factory=list)
