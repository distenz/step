# highest Vue supported LTS, 
# current default lts distro. explicit, if for some unholy (like PHP/apache did) reasons, they change the distro behind the lts or 16 tag
FROM node:16-buster AS base

# init basedir for the project
RUN mkdir -p /srv/app
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
