.PHONY: build 
build:
	@go build -o bin/Startup
.PHONY: run
run:
	@./bin/Startup
.PHONY: test 
test:
	@go test -v ./... 
.PHONY: up
up:
	docker compose up --build  

.PHONY: down 
down: 
	docker compose down

.PHONY: start-container 
start-container: 
	docker compose start 

.PHONY: stop-container
stop-container:
	docker compose stop 

