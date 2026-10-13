run:
	uv sync && uv run touski

makemigrations:
	uv run alembic revision --autogenerate

migrate:
	uv run alembic upgrade head

downgrade:
	uv run alembic downgrade -1
