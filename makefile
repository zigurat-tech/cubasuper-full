#start
.PHONY start:
start: build
	docker-compose up

#start detatch
.PHONY start-detatch:
start-detatch: build
	docker compose up -d

#start detatch
.PHONY migrate:
migrate:
	docker exec cubasuper-api python3 manage.py migrate

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