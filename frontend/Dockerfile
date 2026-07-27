FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Se VITE_API_URL vier definida (deploy em nuvem), o Vite "assa" a URL absoluta
# do backend no bundle JS, e o navegador passa a chamar o backend direto (via
# CORS) em vez de depender do proxy do Nginx. Localmente essa ARG fica vazia,
# e o app continua usando caminho relativo + proxy do Nginx, sem mudança.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 80
