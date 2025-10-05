FROM python:3.13.7-alpine3.22
ARG ENVIRONMENT
ENV PYTHONUNBUFFERED 1
RUN mkdir /backend
WORKDIR /backend
COPY . /backend
RUN apk update && apk add --no-cache bash gcc musl-dev python3-dev libpq-dev
RUN pip3 install -r requirements/base.txt &&\
    if [ "$ENVIRONMENT" = "local" ]; then \
    pip3 install -r requirements/local.txt; \
    fi
