#Dockerfile
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./ 
RUN go mod download 
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /Startup 

FROM alpine:latest
WORKDIR / 
COPY --from=builder /Startup /Startup
EXPOSE 3000
CMD ["/Startup"]
