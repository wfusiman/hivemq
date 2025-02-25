FROM node:18-alpine AS front

WORKDIR /home/app/front

RUN npm install -g @angular/cli
#RUN npm install -g bootstrap@5.3.3

COPY package.json package-lock.json ./
RUN npm install

#RUN mkdir ang-front
#WORKDIR /ang-front

#ENV APP_NAME 'app-mqtt'
#ENV ROUTING 'true'
#ENV STANDALONE 'false'
#ENV STRICT 'true'
#ENV STYLE 'scss'

#CMD ng new $APP_NAME --routing=$ROUTING --standalone=$STANDALONE --strict=$STRICT --style=$STYLE \
    #&& mv $APP_NAME/* . \
    #&& rm -rf $APP_NAME \
    #&& ng serve --host 0.0.0.0 --port 4200

COPY . .
CMD ["ng", "serve", "--host", "0.0.0.0","--port","4200"]

EXPOSE 4200