#!/bin/bash
sed -i 's/console.warn(`\[Retry\] fetch ${url} failed/const safeUrl = url.split("?")[0];\n      console.warn(`\[Retry\] fetch ${safeUrl} failed/' server.js
