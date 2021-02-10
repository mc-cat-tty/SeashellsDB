FROM mariadb:latest
  
COPY ./data.sql /docker-entrypoint-initdb.d/

ENV MYSQL_ROOT_PASSWORD fermi
ENV MYSQL_DATABASE conchiglie
ENV MYSQL_USER writeuser
ENV MYSQL_PASSWORD fermi

#CMD mysql --user="root" --password="$MYSQL_ROOT_PASSWORD" --database="$MYSQL_DATABASE" < /docker-entrypoint-initdb.d/data.sql

