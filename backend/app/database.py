from sqlmodel import SQLModel, create_engine, Session

from app.config import settings

# .NET: engine equivale a la configuración del DbContext (connection string, options)
engine = create_engine(
    settings.DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
)


def create_db_and_tables():
    """Crea las tablas en la base de datos."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Generador de sesión para dependencia de FastAPI."""
    # .NET: Esto maneja el ciclo de vida del DbContext (Scoped).
    # Crea la sesión al inicio del request y la cierra al final (Dispose).
    with Session(engine) as session:
        yield session
