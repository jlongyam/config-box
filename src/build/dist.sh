#!/usr/bin/env bash
VER=$(cat "./version.txt")
CSS=$(cat "../config-box.min.css")
JS=$(cat "../config-box.min.js")
# build
echo "$VER" > "../../dist/config-box.min.css"
echo "$CSS" >>  "../../dist/config-box.min.css"
echo "$VER" > "../../dist/config-box.min.js"
echo "$JS" >>  "../../dist/config-box.min.JS"