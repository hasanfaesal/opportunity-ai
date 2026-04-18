from fastapi.middleware.cors import CORSMiddleware
from .config import settings


def make_middlewares():
    allowed_origins = [
        settings.ADMIN_FE_URL,
        settings.USER_FE_URL,
        'http://localhost:8078',
        'http://127.0.0.1:8078',
        'http://localhost:8087',
        'http://localhost:8088',
    ]
    allowed_origins = [origin for origin in allowed_origins if origin]

    return [
        CORSMiddleware(
            allow_origins=allowed_origins,
            allow_credentials=True,
            allow_methods=['*'],
            allow_headers=['*'],
        ),
    ]
