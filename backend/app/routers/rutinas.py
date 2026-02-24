from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlmodel import Session, select

from app.database import get_session
from app.models import Rutina, Ejercicio
from app.models.ejercicio import DiaSemana
from app.schemas.rutina import RutinaCreate, RutinaUpdate, RutinaRead, RutinaReadConEjercicios
from app.schemas.ejercicio import EjercicioReadSinRutina

router = APIRouter(prefix="/rutinas", tags=["Rutinas"])


def _rutina_to_read_con_ejercicios(r: Rutina) -> RutinaReadConEjercicios:
    """Convierte Rutina a RutinaReadConEjercicios con ejercicios ordenados por día y orden."""
    ejercicios_sorted = sorted(
        r.ejercicios,
        key=lambda e: (e.dia_semana.value, e.orden),
    )
    return RutinaReadConEjercicios(
        id=r.id,
        nombre=r.nombre,
        descripcion=r.descripcion,
        fecha_creacion=r.fecha_creacion,
        ejercicios=[
            EjercicioReadSinRutina(
                id=ex.id,
                nombre=ex.nombre,
                dia_semana=ex.dia_semana,
                series=ex.series,
                repeticiones=ex.repeticiones,
                peso=ex.peso,
                notas=ex.notas,
                orden=ex.orden,
            )
            for ex in ejercicios_sorted
        ],
    )


@router.get("", response_model=list[RutinaRead])
def listar_rutinas(session: Session = Depends(get_session)):
    """Lista todas las rutinas (resumen, sin ejercicios)."""
    rutinas = session.exec(select(Rutina).order_by(Rutina.fecha_creacion.desc())).all()
    return list(rutinas)


@router.get("/buscar", response_model=list[RutinaRead])
def buscar_rutinas(
    nombre: str = Query(..., min_length=1),
    session: Session = Depends(get_session),
):
    """Busca rutinas por nombre (parcial, sin distinguir mayúsculas/minúsculas)."""
    filtro = Rutina.nombre.ilike(f"%{nombre}%")
    rutinas = session.exec(select(Rutina).where(filtro).order_by(Rutina.nombre)).all()
    return list(rutinas)


@router.get("/{rutina_id}", response_model=RutinaReadConEjercicios)
def obtener_rutina(rutina_id: int, session: Session = Depends(get_session)):
    """Obtiene el detalle de una rutina con sus ejercicios."""
    rutina = session.get(Rutina, rutina_id)
    if not rutina:
        raise HTTPException(status_code=404, detail="Rutina no encontrada")
    session.refresh(rutina)  # cargar ejercicios
    return _rutina_to_read_con_ejercicios(rutina)


def _existe_nombre_rutina(session: Session, nombre: str, excluir_id: int | None = None) -> bool:
    """True si ya existe una rutina con ese nombre (excluyendo excluir_id si se pasa)."""
    stmt = select(Rutina).where(func.lower(Rutina.nombre) == nombre.lower())
    if excluir_id is not None:
        stmt = stmt.where(Rutina.id != excluir_id)
    return session.exec(stmt).first() is not None


@router.post("", response_model=RutinaReadConEjercicios, status_code=201)
def crear_rutina(body: RutinaCreate, session: Session = Depends(get_session)):
    """Crea una nueva rutina y opcionalmente sus ejercicios."""
    if _existe_nombre_rutina(session, body.nombre):
        raise HTTPException(
            status_code=400,
            detail="Ya existe una rutina con ese nombre. El nombre debe ser único.",
        )
    rutina = Rutina(nombre=body.nombre, descripcion=body.descripcion)
    session.add(rutina) 
    session.flush()     
    
    for i, ex in enumerate(body.ejercicios):
        ejercicio = Ejercicio(
            rutina_id=rutina.id,
            nombre=ex.nombre,
            dia_semana=ex.dia_semana,
            series=ex.series,
            repeticiones=ex.repeticiones,
            peso=ex.peso,
            notas=ex.notas,
            orden=ex.orden if ex.orden != 0 else i,
        )
        session.add(ejercicio)
    session.commit() 
    session.refresh(rutina)
    return _rutina_to_read_con_ejercicios(rutina)


@router.put("/{rutina_id}", response_model=RutinaReadConEjercicios)
def actualizar_rutina(
    rutina_id: int,
    body: RutinaUpdate,
    session: Session = Depends(get_session),
):
    """Actualiza una rutina. Si se envían ejercicios, se reemplazan los existentes."""
    rutina = session.get(Rutina, rutina_id)
    if not rutina:
        raise HTTPException(status_code=404, detail="Rutina no encontrada")

    if body.nombre is not None:
        if _existe_nombre_rutina(session, body.nombre, excluir_id=rutina_id):
            raise HTTPException(
                status_code=400,
                detail="Ya existe otra rutina con ese nombre. El nombre debe ser único.",
            )
        rutina.nombre = body.nombre
    if body.descripcion is not None:
        rutina.descripcion = body.descripcion

    if body.ejercicios is not None:
        for e in rutina.ejercicios:
            session.delete(e)
        session.flush()
        for i, ex in enumerate(body.ejercicios):
            ejercicio = Ejercicio(
                rutina_id=rutina.id,
                nombre=ex.nombre,
                dia_semana=ex.dia_semana,
                series=ex.series,
                repeticiones=ex.repeticiones,
                peso=ex.peso,
                notas=ex.notas,
                orden=ex.orden if ex.orden != 0 else i,
            )
            session.add(ejercicio)

    session.commit()
    session.refresh(rutina)
    return _rutina_to_read_con_ejercicios(rutina)


@router.delete("/{rutina_id}", status_code=204)
def eliminar_rutina(rutina_id: int, session: Session = Depends(get_session)):
    """Elimina una rutina y todos sus ejercicios (cascada)."""
    rutina = session.get(Rutina, rutina_id)
    if not rutina:
        raise HTTPException(status_code=404, detail="Rutina no encontrada")
    session.delete(rutina)
    session.commit()
    return None
