FROM python:3.9-alpine

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
RUN echo "http://dl-cdn.alpinelinux.org/alpine/v3.12/community" >> /etc/apk/repositories


RUN mkdir -p /app/backend/
WORKDIR /app/backend/

COPY ./requirements.txt .

RUN apk add --update --no-cache postgresql-client jpeg-dev
RUN apk add --update --no-cache --virtual .tmp-build-deps \
    gcc libc-dev linux-headers postgresql-dev musl-dev zlib zlib-dev \
    libressl-dev libffi-dev
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

# delete the temporary requirements
RUN apk del .tmp-build-deps

COPY . .

# RUN mkdir -p /vol/web/media
# RUN mkdir -p /vol/web/static

# RUN adduser -D user
# # change the owner of the dirs.
# RUN chown -R user:user /vol/
# # the owner only have all priviliges (user)
# RUN chmod -R 755 /vol/web
# # change user
# USER user

EXPOSE 8000

ENTRYPOINT ["/app/backend/entrypoint.sh"]
