#!/bin/sh

# Wait for database to be ready
echo "Waiting for database connection (db:3306)..."
while ! nc -z db 3306; do
  echo "Database not ready yet, retrying in 2 seconds..."
  sleep 2
done
echo "Database is ready! Starting application..."

# Run migrations/seeders
# Run migrations/seeders
if [ "$RUN_SEEDER" = "true" ]; then
    echo "Running seeders..."
    python -m seeders.run
else
    echo "Skipping seeders..."
fi

# Start the application
exec "$@"
