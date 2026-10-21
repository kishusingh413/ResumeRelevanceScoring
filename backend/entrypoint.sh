#!/bin/sh
set -e

python manage.py migrate --noinput
mkdir -p /app/media/resumes

if [ "$#" -eq 0 ]; then
  exec python manage.py runserver 0.0.0.0:8000 --noreload
fi

exec "$@"
