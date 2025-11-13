#!/bin/sh
set -e

echo "⏳ Attente des dépendances..."
until nc -z postgres_saas 5432; do
  echo "Postgres non prêt, nouvelle tentative..."
  sleep 3
done

until nc -z redis_saas 6379; do
  echo "Redis non prêt, nouvelle tentative..."
  sleep 3
done

until nc -z kafka_saas 9092; do
  echo "Kafka non prêt, nouvelle tentative..."
  sleep 3
done

echo "✅ Toutes les dépendances sont prêtes !"
echo "🚀 Lancement de Spring Boot..."
exec java -jar app.jar
