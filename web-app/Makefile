GOARCH := $(shell go env GOARCH)
GOOS := $(shell go env GOOS)
APP ?= app

default: run

# .PHONY: build

run:
	@echo "Running app..."
	@(npm run dev)

prettier-fix:
	@(npx prettier --write .)

prettier-check:
	@(npx prettier --check .)

lint-check:
	@(npm run lint)

graphql-schema-ts-gen: 
	@(npx graphql-codegen)
	@(make prettier-fix)
