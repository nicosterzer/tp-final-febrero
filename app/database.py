from sqlmodel import SQLModel, create_engine, Session

from app.config import settings

connect_args = {}
if "sqlite" in settings.DATABASE_URL:
    connect_args["check_same_thread"] = False

engine = create_engine(
    settings.DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    connect_args=connect_args,
)


def create_db_and_tables():
    """Crea las tablas en la base de datos."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Generador de sesión para dependencia de FastAPI."""
    # Crea la sesión al inicio del request y la cierra al final (Dispose).
    with Session(engine) as session:
        yield session
