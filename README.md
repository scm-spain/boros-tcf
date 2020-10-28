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

  A cookie named "borosTcf" is stored with the user consents stringified data, encoded in Base64.
  
  Sample `borosTcf` value: `eyJwb2xpY3lWZXJzaW9uIjoyLCJjbXBWZXJzaW9uIjoxLCJwdXJwb3NlIjp7ImNvbnNlbnRzIjp7IjEiOnRydWUsIjIiOnRydWUsIjMiOnRydWUsIjQiOnRydWUsIjUiOnRydWUsIjYiOnRydWUsIjciOnRydWUsIjgiOnRydWUsIjkiOnRydWUsIjEwIjp0cnVlfX0sInNwZWNpYWxGZWF0dXJlcyI6eyIxIjp0cnVlfX0=`
  
  The encoded data in this sample value, and the cookie encoded data structure is:
  ```
  {
    "policyVersion": 2,
    "cmpVersion": 1,
    "purpose": {
      "consents": {
        "1": true,
        "2": true,
        "3": true,
        "4": true,
        "5": true,
        "6": true,
        "7": true,
        "8": true,
        "9": true,
        "10": true
      }
    },
    "specialFeatures": {
      "1": true
    }
  }
  ```
  
  To decode the cookie, p.ex.:
  
  ```
  // Java
  String decoded = new String(Base64.getDecoder().decode(cookieValue));
  
  // Node
  const decoded = Buffer.from(cookieValue, 'base64').toString()
  
  ```

`npm i @adv-ui/boros-tcf`

### Initialization

```
import BorosTcf from '@adv-ui/boros-tcf'

const borosTcf = BorosTcf.init()
```

**Allowed initialization parameters**

`BorosTcf.init({language, reporter})`

- `language` (optional, defaults to 'es'), a valid two-letter ISO 639-1 language code
- `reporter` (optional), a function which can receive `(event, payload)` parameters. Boros TCF relevant actions will be notified to the reporter, which can be used p.ex. to debug.

> Boros TCF actually will report events
> - LISTENER_ERROR: any error on registered event status listeners  
> - USE_CASE_CALLED: any call to the use cases, which has finished OK 
> - USE_CASE_ERROR: any call to the use cases, which has failed due to an error 
> - LOAD_CONSENT_ERROR: loading the stored consent catched an error and an empty consent will be returned 

## License

Boros TCF is [MIT licensed](./LICENSE).
