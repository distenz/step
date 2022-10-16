#!/usr/bin/env bash
umask 002

echo "Running Node.js in '${DOKERIZER_ENV:-development}' environment with '${@}' command(s).."

#
export NODE_ENV="${DOKERIZER_ENV:-development}"

npm update --include=dev &&\
npm run $@ || exit 1