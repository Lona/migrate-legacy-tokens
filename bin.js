#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const sywac = require("sywac");

const {
  convertColors,
  convertShadows,
  convertTextStyles
} = require("./index.js");

const transformers = {
  "colors.json": convertColors,
  "shadows.json": convertShadows,
  "textStyles.json": convertTextStyles
};

sywac
  .usage("Usage: @lona/migrate-legacy-tokens file")
  .positional("file", { paramsDesc: "The JSON file to convert" })
  .help("-h, --help")
  .version("-v, --version")
  .showHelpByDefault()
  .parseAndExit()
  .then(argv => {
    const { file } = argv;

    const suffix = Object.keys(transformers).find(suffix =>
      file.endsWith(suffix)
    );
    const transformer = transformers[suffix];

    if (!transformer) {
      return Promise.reject(
        "Valid input files are: colors.json, textStyles.json, or shadows.json"
      );
    }

    const data = fs.readFileSync(argv.file, "utf8");
    const json = JSON.parse(data);
    const output = transformer(json);
    printOutput(output);
  })
  .catch(error => {
    console.log(error);
    process.exit(1);
  });

function printOutput(output) {
  console.log(output);
}
