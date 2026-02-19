from app.models.ejercicio import DiaSemana
from pydantic import BaseModel, Field


class EjercicioBase(BaseModel):
    """Schema base para ejercicio."""

    nombre: str = Field(..., min_length=1, max_length=200)
    dia_semana: DiaSemana
    series: int = Field(..., gt=0, le=100)
    repeticiones: int = Field(..., gt=0, le=1000)
    peso: float | None = Field(default=None, gt=0, le=500)
    notas: str | None = Field(default=None, max_length=500)
    orden: int = Field(default=0, ge=0)


class EjercicioCreate(EjercicioBase):
    """Schema para crear ejercicio."""

    pass


class EjercicioUpdate(BaseModel):
    """Schema para actualizar ejercicio (todos los campos opcionales)."""

    nombre: str | None = Field(default=None, min_length=1, max_length=200)
    dia_semana: DiaSemana | None = None
    series: int | None = Field(default=None, gt=0, le=100)
    repeticiones: int | None = Field(default=None, gt=0, le=1000)
    peso: float | None = Field(default=None, gt=0, le=500)
    notas: str | None = Field(default=None, max_length=500)
    orden: int | None = Field(default=None, ge=0)


class EjercicioRead(EjercicioBase):
    """Schema de lectura para ejercicio."""

    id: int
    rutina_id: int


class EjercicioReadSinRutina(EjercicioBase):
    """Schema de lectura sin rutina_id (para anidar en Rutina)."""

    id: int
