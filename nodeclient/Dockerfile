FROM node:alpine AS nodeserver

WORKDIR /home/dev/servernode

RUN npm install express --save
RUN npm install cors --save 
RUN npm ins tall body-parser --save
RUN npm install mqtt --save

EXPOSE 3300

CMD ["node", "./server.js"]

