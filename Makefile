GOARCH := $(shell go env GOARCH)
GOOS := $(shell go env GOOS)
APP ?= app

default: run

# .PHONY: build

run:
	@echo "Running app..."
	@(python manage.py runserver)

migrations:
	@echo "Creating migrations..."
	@(python manage.py makemigrations $(APP))

empty-migrations:
	@echo "Creating empty migration..."
	@(python manage.py makemigrations --empty $(APP))
	
migrate:
	@echo "Running migrations..."
	@(python manage.py migrate $(APP))

export_graphql:
	@(python manage.py export_schema app.graphql.schema --path ./graphql/schema.graphql)

ruff-fix:
	@echo "Fixing files' format..."
	@(ruff check . --fix && ruff format .)

ruff-check:
	@echo "Checking files' format..."
	@(ruff check . && ruff format . --check)
	
run-tests:
	@echo "Running tests"
	@(pytest --maxfail=1)