#!/bin/sh
cat <<EOF > /usr/share/nginx/html/config.js
window._env_ = {
  BACKEND_URL: "${BACKEND_URL}",
  APPLICATIONINSIGHTS_CONNECTION_STRING: "${APPLICATIONINSIGHTS_CONNECTION_STRING}",
  APP_NAME: "${APP_NAME}",
};
EOF
exec nginx -g "daemon off;"