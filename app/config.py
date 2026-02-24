from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Configuración de la aplicación desde variables de entorno."""

    # Base de datos (SQLite por defecto)
    # Formato: sqlite:///nombre_archivo.db
    DATABASE_URL: str = "sqlite:///gym_rutinas.db"

    # API
    API_PREFIX: str = "/api"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
