#!/bin/sh

# Wait for database to be ready
echo "Waiting for database connection..."
while ! nc -z db 3306; do
  sleep 0.1
done
echo "Database is ready!"

# Run migrations/seeders
echo "Running seeders..."
python -m seeders.run

# Start the application
exec "$@"
