# highest Vue supported LTS, 
# current default lts distro. explicit, if for some unholy (like PHP/apache did) reasons, they change the distro behind the lts or 16 tag
FROM node:16-buster AS base

RUN npm install -g npm@8

EXPOSE 4200/tcp

# init basedir for the project
RUN mkdir /srv/app
WORKDIR /srv/app

# copy startup script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# development environment, with bind mounts
FROM base AS development

#
ENTRYPOINT [ "/entrypoint.sh" ]

FROM base AS production

FROM production AS test

#
