# Docker Setup for SmartHireLabs

This project is now configured with Docker for containerization.

## Files Created

1. **Dockerfile** - Multi-stage Docker build configuration
   - Build stage: Compiles TypeScript and bundles the application
   - Runtime stage: Lightweight production image with only necessary dependencies
   - Security: Runs as non-root user
   - Health checks enabled

2. **docker-compose.yml** - Docker Compose configuration for easy local development
   - Service configuration for the application
   - Port mapping (5001:5001)
   - Environment variables

3. **.dockerignore** - Excludes unnecessary files from Docker build context

## Building the Docker Image

```bash
# Build the Docker image
docker build -t smarthire:latest .

# Or using Docker Compose
docker-compose build
```

## Running the Container

### Using Docker directly:

```bash
# Run the container
docker run -p 5001:5001 \
  -e NODE_ENV=production \
  -e PORT=5001 \
  smarthire:latest

# With environment file
docker run -p 5001:5001 --env-file .env.production smarthire:latest
```

### Using Docker Compose:

```bash
# Start the application
docker-compose up

# Start in detached mode (background)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

## Environment Variables

Create a `.env.production` file with necessary variables:

```
NODE_ENV=production
PORT=5001
# Add other environment variables as needed
```

## Health Check

The container includes a built-in health check that verifies the application is running on port 5001.

## Notes

- The application is set to bind to `127.0.0.1:5001` (localhost) in development
- For production Docker deployment, you may want to change the host binding to `0.0.0.0` in the server configuration
- The multi-stage build keeps the final image size minimal
- Non-root user (nodejs) runs the application for security
