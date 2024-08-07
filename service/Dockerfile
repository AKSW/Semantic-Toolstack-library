from python:3.10

ADD ./* /srv/

RUN cd /srv && pip install -r requirements.txt

WORKDIR /srv

ENTRYPOINT python3 app.py