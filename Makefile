.PHONY: install test lint fmt fmt-check

BACKEND := backend
FRONTEND := frontend

install:
	cd $(BACKEND) && pip install -r requirements-dev.txt
	cd $(FRONTEND) && npm ci

# Backend tests with a 70% coverage floor
test:
	cd $(BACKEND) && python -m pytest --cov=app --cov-report=term-missing --cov-fail-under=70

lint:
	cd $(BACKEND) && ruff check .
	cd $(FRONTEND) && npm run lint

fmt:
	cd $(BACKEND) && ruff check --fix . && ruff format .

fmt-check:
	cd $(BACKEND) && ruff format --check .
