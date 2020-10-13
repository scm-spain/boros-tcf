![](/resources/logo/boros_logo.png)

# Boros TCF

[![Build status](https://travis-ci.org/scm-spain/boros-tcf.svg?branch=master)](https://travis-ci.org/scm-spain/boros-tcf)
[![codecov](https://codecov.io/gh/scm-spain/boros-tcf/branch/master/graph/badge.svg)](https://codecov.io/gh/scm-spain/boros-tcf)
[![GitHub license](https://img.shields.io/github/license/scm-spain/boros-tcf.svg)](https://github.com/scm-spain/boros-tcf/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/@adv-ui/boros-tcf.svg)](https://www.npmjs.com/package/@adv-ui/boros-tcf)

## Table of Contents

- [About](#about)
- [Features](#features)
- [License](#license)

## About

**Boros TCF** is a stand alone Consent Management Provider solution compliant with the "Transparency & Consent Framework version 2.0" standard established by the [IAB Europe](https://iabeurope.eu/tcf-2-0/).

## Features

* Initialization with Stub, [see details here](https://github.com/scm-spain/boros-tcf-stub)
* Extra cookie storage

  A cookie named "borosTcf" is stored with the user consents stringified data.
  The structure of that cookie is:
  ```
  {policyVersion: 2, cmpVersion: 12, purpose: {consents: {1: true, 2: true, 3: false, ....}}, specialFeatureOptions: {1: true}}
  ```

## License

Boros TCF is [MIT licensed](./LICENSE).
