from fastapi import FastAPI
from api import api_router
from .exceptions import (
    HTTPException,
    HttpExcHandle,
    RequestValidationError,
    RequestValidationHandle,
    ResponseValidationError,
    ResponseValidationHandle,
)
from .middlewares import make_middlewares


def register_exceptions(app: FastAPI):
    app.add_exception_handler(HTTPException, HttpExcHandle)
    app.add_exception_handler(RequestValidationError, RequestValidationHandle)
    app.add_exception_handler(ResponseValidationError, ResponseValidationHandle)


def register_routers(app: FastAPI):
    app.include_router(api_router, prefix='/api')


async def init_data(app: FastAPI):
    pass
