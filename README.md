# danger-plugin-xcode-report

[![Build Status](https://travis-ci.org/stevethomp/danger-plugin-xcode-report.svg?branch=master)](https://travis-ci.org/stevethomp/danger-plugin-xcode-report)
[![npm version](https://badge.fury.io/js/danger-plugin-xcode-report.svg)](https://badge.fury.io/js/danger-plugin-xcode-report)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> Add your Xcode test results to Danger.

## Usage

Install:

```sh
yarn add danger-plugin-xcode-report --dev
```

At a glance:

```js
// dangerfile.js
import generateXcodeReport from 'danger-plugin-xcode-report'

generateXcodeReport({})
```

This plugin requires json formatted results provided by [xcpretty-json-formatter](https://github.com/marcelofabri/xcpretty-json-formatter). The default export directory is `./build/reports/errors.json`, which is where `danger-plugin-xcode-report` looks for it by default. If you change that just provide a different `pathToReport` in the options.

Take a look at [XcodeReportOptions](https://github.com/stevethomp/danger-plugin-xcode-report/blob/f6f51780fcd2c6988387d92639cfee98b548356a/src/index.ts#L15) for the options you can provide to the pugin.

## Changelog

See the GitHub [release history](https://github.com/stevethomp/danger-plugin-xcode-report/releases).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
