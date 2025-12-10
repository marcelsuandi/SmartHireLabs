#!/bin/bash
set -e

usage() {
  echo "Usage: ./compose.sh [command]"
  echo "Commands: build | up | down | logs | ps | restart | clean | help"
}

compose() {
  if command -v docker-compose >/dev/null 2>&1; then
    docker-compose "$@"
  else
    docker compose "$@"
  fi
}

case "${1:-help}" in
  build)
    compose build
    ;;
  up)
    compose up -d
    echo "Application running at: http://127.0.0.1:5001"
    ;;
  down)
    compose down
    ;;
  logs)
    compose logs -f app
    ;;
  ps)
    compose ps
    ;;
  restart)
    compose restart
    ;;
  clean)
    compose down -v
    ;;
  help)
    usage
    ;;
  *)
    usage
    exit 1
    ;;
esac
