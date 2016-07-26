#
#  $ docker build -t dosplash .
#  $ docker pull mongo:latest
#  $ docker run -d --name mongo1 mongo
#  $ docker run -it --name dosplash1 --link mongo1:mongo -w /dosplash -p 3000:3000 dosplash
#

FROM node:latest

RUN mkdir -p /dosplash /home/nodejs && \
    groupadd -r nodejs && \
    useradd -r -g nodejs -d /home/nodejs -s /sbin/nologin nodejs && \
    chown -R nodejs:nodejs /home/nodejs

WORKDIR /dosplash

COPY package.json typings.json /dosplash/

RUN npm install

COPY . /dosplash

RUN chown -R nodejs:nodejs /dosplash
USER nodejs

CMD [ "npm", "start" ]