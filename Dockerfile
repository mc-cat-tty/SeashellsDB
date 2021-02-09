FROM python:3.7

COPY database/interface.py /database/app/
COPY requirements.txt /app/

RUN pip install -r /app/requirements.txt
RUN pip install gunicorn

ENV PORT 8080

EXPOSE $PORT
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 server:app
