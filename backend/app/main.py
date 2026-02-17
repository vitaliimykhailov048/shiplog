from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routers import auth, shipments


def create_app() -> FastAPI:
    app = FastAPI(title="shiplog", version="0.1.0")

    origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth.router)
    app.include_router(shipments.router)

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    return app


app = create_app()
