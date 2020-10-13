![](/resources/logo/boros_logo.png)

# Boros TCF

[![Build status](https://travis-ci.org/scm-spain/boros-tcf.svg?branch=master)](https://travis-ci.org/scm-spain/boros-tcf)
[![codecov](https://codecov.io/gh/scm-spain/boros-tcf/branch/master/graph/badge.svg)](https://codecov.io/gh/scm-spain/boros-tcf)
[![GitHub license](https://img.shields.io/github/license/scm-spain/boros-tcf.svg)](https://github.com/scm-spain/boros-tcf/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/@adv-ui/boros-tcf.svg)](https://www.npmjs.com/package/@adv-ui/boros-tcf)

## Table of Contents

* [About](#about)
* [Features](#features)
* [Technical features](#technical-features)
* [Configuration](#configuration)
* [Usage](#usage)
* [License](#license)


## About

## Features

* Initialization with Stub, [see details here](https://github.com/scm-spain/boros-tcf-stub)
 
## Technical features

## Usage

`npm i @adv-ui/boros-tcf`

### Initialization

```
import BorosTcf from '@adv-ui/boros-tcf'

const borosTcf = BorosTcf.init()
```

**Allowed initialization parameters**

`BorosTcf.init({language, reporter})`

- `language` (optional, defaults to 'es'), a valid two-letter ISO 639-1 language code
- `reporter` (optional), an object which must have a `notify(event, payload)` method. Boros TCF relevant actions will be notified to the reporter, which can be used p.ex. to debug.

> Boros TCF actually will report events
> - LISTENER_ERROR: any error on registered event status listeners  
> - EVENT_STATUS_CHANGED: any cmp status, ui status or event status change

## License
Boros TCF is [MIT licensed](./LICENSE).
