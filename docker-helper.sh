#!/bin/bash
# SmartHireLabs Docker Helper Script for Linux/Mac

set -e

help() {
  echo "SmartHireLabs Docker Helper"
  echo ""
  echo "Usage: ./docker-helper.sh [command]"
  echo ""
  echo "Commands:"
  echo "  build       Build the Docker image"
  echo "  up          Start the container"
  echo "  down        Stop the container"
  echo "  logs        View container logs"
  echo "  ps          Show container status"
  echo "  restart     Restart the container"
  echo "  clean       Remove everything (containers, images, volumes)"
  echo "  help        Show this help message"
  echo ""
  echo "Examples:"
  echo "  ./docker-helper.sh build"
  echo "  ./docker-helper.sh up"
  echo "  ./docker-helper.sh down"
}

case "${1:-help}" in
  build)
    echo "Building Docker image..."
    docker-compose build
    ;;
  up)
    echo "Starting container..."
    docker-compose up -d
    echo ""
    echo "Application running at: http://127.0.0.1:5001"
    ;;
  down)
    echo "Stopping container..."
    docker-compose down
    ;;
  logs)
    echo "Showing logs..."
    docker-compose logs -f app
    ;;
  ps)
    echo "Container status:"
    docker-compose ps
    ;;
  restart)
    echo "Restarting container..."
    docker-compose restart
    ;;
  clean)
    echo "Removing containers, images, and volumes..."
    docker-compose down -v
    ;;
  help)
    help
    ;;
  *)
    echo "Unknown command: $1"
    echo ""
    help
    exit 1
    ;;
esac
