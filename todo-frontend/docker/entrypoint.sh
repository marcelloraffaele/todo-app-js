#!/bin/sh
set -eu

config=$(jq -n \
  --arg backend_url "${BACKEND_URL:-}" \
  --arg connection_string "${APPLICATIONINSIGHTS_CONNECTION_STRING:-}" \
  --arg app_name "${APP_NAME:-}" \
  '{BACKEND_URL: $backend_url, APPLICATIONINSIGHTS_CONNECTION_STRING: $connection_string, APP_NAME: $app_name}')
printf 'window._env_ = %s;\n' "$config" > /usr/share/nginx/html/config.js
exec nginx -g "daemon off;"