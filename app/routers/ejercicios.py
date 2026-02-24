from fastapi import APIRouter, Depends, HTTPException

from app.database import get_session
from app.models import Rutina, Ejercicio
from app.schemas.ejercicio import EjercicioCreate, EjercicioUpdate, EjercicioRead
from sqlmodel import Session

router = APIRouter(tags=["Ejercicios"])


@router.post("/rutinas/{rutina_id}/ejercicios", response_model=EjercicioRead, status_code=201)
def agregar_ejercicio(
    rutina_id: int,
    body: EjercicioCreate,
    session: Session = Depends(get_session),
):
    """Agrega un ejercicio a una rutina existente."""
    rutina = session.get(Rutina, rutina_id)
    if not rutina:
        raise HTTPException(status_code=404, detail="Rutina no encontrada")
    ejercicio = Ejercicio(
        rutina_id=rutina_id,
        nombre=body.nombre,
        dia_semana=body.dia_semana,
        series=body.series,
        repeticiones=body.repeticiones,
        peso=body.peso,
        notas=body.notas,
        orden=body.orden,
    )
    session.add(ejercicio)
    session.commit()
    session.refresh(ejercicio)
    return ejercicio


@router.put("/ejercicios/{ejercicio_id}", response_model=EjercicioRead)
def actualizar_ejercicio(
    ejercicio_id: int,
    body: EjercicioUpdate,
    session: Session = Depends(get_session),
):
    """Actualiza un ejercicio existente."""
    ejercicio = session.get(Ejercicio, ejercicio_id)
    if not ejercicio:
        raise HTTPException(status_code=404, detail="Ejercicio no encontrado")
    data = body.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(ejercicio, key, value)
    session.add(ejercicio)
    session.commit()
    session.refresh(ejercicio)
    return ejercicio


@router.delete("/ejercicios/{ejercicio_id}", status_code=204)
def eliminar_ejercicio(
    ejercicio_id: int,
    session: Session = Depends(get_session),
):
    """Elimina un ejercicio."""
    ejercicio = session.get(Ejercicio, ejercicio_id)
    if not ejercicio:
        raise HTTPException(status_code=404, detail="Ejercicio no encontrado")
    session.delete(ejercicio)
    session.commit()
    return None
