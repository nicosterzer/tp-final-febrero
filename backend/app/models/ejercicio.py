from enum import Enum
from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.rutina import Rutina


class DiaSemana(str, Enum):
    """Días de la semana válidos."""

    LUNES = "Lunes"
    MARTES = "Martes"
    MIERCOLES = "Miércoles"
    JUEVES = "Jueves"
    VIERNES = "Viernes"
    SABADO = "Sábado"
    DOMINGO = "Domingo"


class Ejercicio(SQLModel, table=True):
    """Modelo de ejercicio dentro de una rutina."""

    __tablename__ = "ejercicios"
    __table_args__ = {"schema": None}

    id: int | None = Field(default=None, primary_key=True)
    rutina_id: int = Field(foreign_key="rutinas.id", index=True)
    nombre: str = Field(min_length=1, max_length=200)
    dia_semana: DiaSemana = Field(index=True)
    series: int = Field(gt=0, le=100)
    repeticiones: int = Field(gt=0, le=1000)
    peso: float | None = Field(default=None, gt=0, le=500)
    notas: str | None = Field(default=None, max_length=500)
    orden: int = Field(default=0, ge=0)

    rutina: "Rutina | None" = Relationship(back_populates="ejercicios")
