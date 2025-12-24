FROM nginx:1.29.3
EXPOSE 8443
STOPSIGNAL SIGTERM

# Definimos las cosas como root
USER root

# Create the necessary directories for Nginx to run with the www-data user
RUN mkdir -p /var/cache/nginx/{client_body,proxy,fastcgi,scgi,uwsgi} && \
    mkdir -p /var/run/nginx && \
    chown -R www-data:www-data /var/cache/nginx /var/run/nginx

# Copiamos la web por defecto de nginx con los errores personalizados
COPY nginx/html /usr/share/nginx/html

# Copiamos los headers
COPY nginx/default.headers /etc/nginx/default.headers

# Copiamos la configuración del site
COPY nginx/webapp.conf /etc/nginx/conf.d/webapp.conf

# Copiamos la configuración
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Install curl command (needed by the healthcheck)
RUN apt-get update && \
    apt-get install --yes --no-install-recommends curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY dist /app

# Configure the healthcheck
HEALTHCHECK --interval=5m --timeout=3s \
  CMD curl -f https://localhost:8443/ || exit 1

# Run the Docker as www-data user and group
USER www-data:www-data

CMD [ "nginx", "-g", "daemon off;" ]
