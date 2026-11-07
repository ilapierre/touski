run-dev:
	uv sync && uv run fastapi dev src/touski/main.py --port 8080

run-app:
	uv sync && uv run fastapi run src/touski/main.py --port 8080

run-frontend:
	cd frontend && npm install && npm run dev

makemigrations:
	uv run alembic revision --autogenerate

migrate:
	uv run alembic upgrade head

downgrade:
	uv run alembic downgrade -1
