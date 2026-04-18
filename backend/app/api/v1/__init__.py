from fastapi import APIRouter

from .base import router as base_router
from .opportunities import router as opportunities_router

v1_router = APIRouter()

v1_router.include_router(base_router, tags=['基础模块'], prefix='/base')
v1_router.include_router(opportunities_router, tags=['机会模块'], prefix='/opportunities')
