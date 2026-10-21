run-app:
	uv sync && uv run touski

run-frontend:
	cd frontend && npm install && npm run dev

makemigrations:
	uv run alembic revision --autogenerate

migrate:
	uv run alembic upgrade head

downgrade:
	uv run alembic downgrade -1
