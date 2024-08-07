from node:16

ADD ./* /srv/

RUN cd /srv && npm install

WORKDIR /srv

ENTRYPOINT printenv | grep '^VITE_' > .env && npm run dev