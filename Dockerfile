FROM python:3.7

WORKDIR /app

COPY server.py /
COPY database/interface.py /database/
COPY requirements.txt /

RUN pip install -r /requirements.txt
RUN pip install gunicorn

ENV PORT 8080

EXPOSE $PORT
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 app:app
