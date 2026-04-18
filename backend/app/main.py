from contextlib import asynccontextmanager
from fastapi import FastAPI
from core.init_app import register_exceptions, register_routers
from core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_TITLE,
        description=settings.APP_DESCRIPTION,
        version=settings.VERSION,
        openapi_url='/openapi.json',
        docs_url='/docs',
        lifespan=lifespan,
    )
    register_exceptions(app)
    register_routers(app)
    return app


app = create_app()
