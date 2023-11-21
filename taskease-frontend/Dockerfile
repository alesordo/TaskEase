FROM node:20.9-alpine as builder

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4200

CMD ["npm","run","docker-start"]

## nginx state to serve content
#FROM nginx:alpine
#
## Set working directory to nginx asset directory
#WORKDIR /usr/share/nginx/html
#
## Remove default nginx assets
#RUN rm -rf ./*
#
## Copy static assets from builder stage
#COPY --from=builder /usr/src/app/dist/taskease-frontend .
#
#RUN chown nginx:nginx /usr/share/nginx/html/*
#
## Container runs nginx with global directives and daemon off
#ENTRYPOINT ["nginx", "-g", "daemon off;"]
