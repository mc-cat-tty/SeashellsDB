FROM python:3.7

WORKDIR /app

COPY database/interface.py /app/database/
COPY requirements.txt /app/
COPY server.py /app/

RUN pip install -r /app/requirements.txt
RUN pip install gunicorn

ENV PORT 8080

EXPOSE $PORT
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 server:app
