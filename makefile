#start
.PHONY start:
start:
	docker compose up

#start detatch
.PHONY start-detatch:
start-detatch:
	docker compose up -d

#build
.PHONY build:
build: build
	make build-web && make build-api

#build web
.PHONY: build-web
build-web:
	docker build -t cubasuper/web:latest ./apps/web

#build api
.PHONY: build-api
build-api:
	docker build -t cubasuper/api:latest ./apps/api