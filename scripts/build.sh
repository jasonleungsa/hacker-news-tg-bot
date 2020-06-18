#!/bin/bash

DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)
BASE_DIR=${DIR/scripts/}
TARGET_DIR=$(echo "${BASE_DIR}dist")

[ -d $TARGET_DIR ] || mkdir $TARGET_DIR

echo $TARGET_DIR

deno bundle "${BASE_DIR}src/app.ts" "${TARGET_DIR}/server.js"
