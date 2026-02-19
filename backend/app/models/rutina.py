from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.ejercicio import Ejercicio


class Rutina(SQLModel, table=True):
    """Modelo de rutina de entrenamiento."""

    __tablename__ = "rutinas"
    __table_args__ = {"schema": None}

    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True, index=True, min_length=1, max_length=200)
    descripcion: str | None = Field(default=None, max_length=1000)
    fecha_creacion: datetime = Field(default_factory=datetime.utcnow)

    ejercicios: list["Ejercicio"] = Relationship(back_populates="rutina", cascade_delete=True)
