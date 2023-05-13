#start
.PHONY start:
start: build
	docker-compose up

#start
.PHONY start-hub:
start-hub:
	docker-compose -f docker-compose.hub.yml up

#start detatch
.PHONY start-detatch:
start-detatch: build
	docker-compose up -d

#start detatch
.PHONY migrate:
migrate:
	docker exec -it cubasuper-api python3 manage.py migrate

#start detatch
.PHONY createsuperuser:
createsuperuser:
	docker exec -it cubasuper-api python3 manage.py createsuperuser


######################## BUILD ###################################

#build
.PHONY build:
build: build
	make build-web && make build-api

#build web
.PHONY: build-web
build-web:
	docker build -t oljimenez/cubasuper:web  ./apps/web

#build api
.PHONY: build-api
build-api:
	docker build -t oljimenez/cubasuper:api ./apps/api
