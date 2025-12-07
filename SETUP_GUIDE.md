# SmartHireLabs - Docker & GitHub Setup Guide

This guide explains how to pull the project from GitHub and run it using Docker.

## Prerequisites

- Docker installed ([Download Docker Desktop](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)
- Git installed

## Option 1: Using Docker (Recommended for Servers)

### Step 1: Clone the Repository

```bash
git clone https://github.com/marcelsuandi/SmartHireLabs.git
cd SmartHireLabs
```

### Step 2: Build the Docker Image

```bash
# Using Docker Compose (Recommended)
docker-compose build

# Or using Docker directly
docker build -t smarthire:latest .
```

### Step 3: Run the Container

#### Using Docker Compose (Simplest):
```bash
docker-compose up -d
```

The application will be available at `http://localhost:5001`

#### Using Docker directly:
```bash
docker run -d \
  -p 5001:5001 \
  -e NODE_ENV=production \
  -e PORT=5001 \
  --name smarthire \
  smarthire:latest
```

### Step 4: Verify it's Running

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f app

# Or with Docker
docker logs smarthire
```

### Step 5: Stop the Container

```bash
# Using Docker Compose
docker-compose down

# Or with Docker
docker stop smarthire
docker rm smarthire
```

## Option 2: Local Development (Without Docker)

### Step 1: Clone the Repository

```bash
git clone https://github.com/marcelsuandi/SmartHireLabs.git
cd SmartHireLabs
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5001`

## Docker Environment Variables

The Docker setup includes the following default environment variables:

- `NODE_ENV=production` - Sets production environment
- `PORT=5001` - Application port

### Adding Custom Environment Variables

Create a `.env.production` file:

```env
NODE_ENV=production
PORT=5001
# Add other variables as needed
```

Then use it with Docker:

```bash
docker run -p 5001:5001 --env-file .env.production smarthire:latest
```

Or with Docker Compose, update the `docker-compose.yml`:

```yaml
services:
  app:
    env_file:
      - .env.production
```

## Docker Images Details

The Dockerfile uses a multi-stage build:

1. **Builder Stage**
   - Node.js 20 Alpine
   - Installs all dependencies
   - Compiles TypeScript
   - Builds the project

2. **Runtime Stage**
   - Node.js 20 Alpine (lightweight)
   - Installs only production dependencies
   - Copies built artifacts
   - Runs as non-root user (nodejs)
   - Includes health checks

**Image Size**: ~300-400MB (optimized for production)

## Server Binding Configuration

For Docker deployment, the server is configured to listen on `127.0.0.1:5001`. If you need to expose it to external networks, you can modify `server/index.ts`:

```typescript
// Change from:
host: "127.0.0.1",

// To:
host: "0.0.0.0",
```

Then rebuild the Docker image.

## Troubleshooting

### Port Already in Use

```bash
# Find and kill process on port 5001
# Windows PowerShell:
Get-Process | Where-Object { $_.ProcessName -like "*node*" } | Stop-Process -Force

# Linux/Mac:
lsof -i :5001 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Container Won't Start

```bash
# Check the logs
docker-compose logs app

# Rebuild the image
docker-compose build --no-cache
```

### Permission Denied

Make sure Docker daemon is running and you have proper permissions.

## File Structure

```
SmartHireLabs/
├── Dockerfile              # Docker build configuration
├── docker-compose.yml      # Docker Compose setup
├── .dockerignore          # Files to exclude from build
├── DOCKER_SETUP.md        # This setup documentation
├── package.json           # Node.js dependencies
├── server/                # Backend server
├── client/                # Frontend React app
├── shared/                # Shared code
└── dist/                  # Built output (created after build)
```

## Next Steps

1. ✅ Push code to GitHub - **DONE**
2. ✅ Docker files created - **DONE**
3. Clone and run on server:
   ```bash
   git clone https://github.com/marcelsuandi/SmartHireLabs.git
   cd SmartHireLabs
   docker-compose up -d
   ```

That's it! Your application will be running in a Docker container.

## Additional Commands

```bash
# View running containers
docker-compose ps

# Access container shell
docker-compose exec app sh

# Rebuild without cache
docker-compose build --no-cache

# Remove all containers and images
docker-compose down -v

# View system usage
docker stats
```

## Support

For more Docker documentation, visit: https://docs.docker.com/
