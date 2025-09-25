#!/bin/bash
npx tsc
npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css