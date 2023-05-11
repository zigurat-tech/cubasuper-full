from pathlib import Path
import environ
import os

env = environ.Env()
environ.Env.read_env()
BASE_DIR = Path(__file__).resolve().parent.parent
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))

SQLITE = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

POSTGRESQL = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": env("POSTGRESQL_NAME"),
        "USER": env("POSTGRESQL_USER"),
        "PASSWORD": env("POSTGRESQL_PASSWORD"),
        "HOST": env("POSTGRESQL_HOST"),
        "PORT": env("POSTGRESQL_PORT"),
    }
}

MYSQL = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "db",
        "USER": "root",
        "PASSWORD": "",
        "HOST": "localhost",
        "PORT": "3306",
        "OPTIONS": {
            "sql_mode": "traditional",
        },
    }
}
