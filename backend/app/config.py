from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Configuración de la aplicación desde variables de entorno."""

    # Base de datos PostgreSQL
    # Formato: postgresql://usuario:contraseña@host:puerto/nombre_bd
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/gym_rutinas"

    # API
    API_PREFIX: str = "/api"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
