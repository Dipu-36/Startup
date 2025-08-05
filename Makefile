.PHONY: build run  test
build :
	@go build -o bin/Startup
run:
	@./bin/Startup
test:
	@go test -v ./... 

