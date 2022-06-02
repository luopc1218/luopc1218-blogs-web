FROM nginx:alpine

COPY ./dist ./app

COPY ./nginx.conf /etc/nginx/nginx.conf


