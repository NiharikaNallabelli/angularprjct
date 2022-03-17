# Stage 1: Compile and Build angular codebase 
# Use official node image as the base image
FROM node:16.10-alpine as node-angular-cli
# Set the working directory
WORKDIR /usr/local/app 
RUN apk update \
  && apk add --update alpine-sdk \
  && apk del alpine-sdk \
  && rm -rf /tmp/* /var/cache/apk/* *.tar.gz ~/.npm \
  && npm cache verify \
  && sed -i -e "s/bin\/ash/bin\/sh/" /etc/passwd

#Angular CLI
RUN npm install -g @angular/cli

RUN ng config -g cli.warnings.versionMismatch false

# Add the source code to app
COPY ./ /usr/local/app/ 
# Install all the dependencies
RUN npm install 
# Generate the build of the application
RUN ng build  
# Stage 2: Serve app with nginx server 
# Use official nginx image as the base image
FROM nginx:latest 
# Copy the build output to replace the default nginx contents.
COPY --from=node-angular-cli /usr/local/app/dist/EzyContracts /usr/share/nginx/html 
# Expose port 80
EXPOSE 80