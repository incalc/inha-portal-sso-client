# Inha Portal SSO Client

> Inha Univ. Portal Single Sign-On Client

[![NPM](https://img.shields.io/npm/v/inha-portal-sso-client?logo=npm&logoColor=white&style=for-the-badge)](https://www.npmjs.com/package/inha-portal-sso-client)
[![Node.js](https://img.shields.io/node/v/inha-portal-sso-client?logo=node.js&logoColor=white&style=for-the-badge)](https://nodejs.org)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/incalc/inha-portal-sso-client/Node.js?logo=github&logoColor=white&style=for-the-badge)](https://github.com/incalc/inha-portal-sso-client/actions)
[![Downloads](https://img.shields.io/npm/dt/inha-portal-sso-client?logo=npm&logoColor=white&style=for-the-badge)](https://www.npmjs.com/package/inha-portal-sso-client)
[![License](https://img.shields.io/npm/l/inha-portal-sso-client?style=for-the-badge)](./LICENSE)

> **NOTE: This library is not working now because of [Inha Univ. Portal site](https://portal.inha.ac.kr/) UI update.**

## ChangeLog

See [CHANGELOG](./CHANGELOG.md)

## Features

- Verify student ID and password
- Fetch student information with login session

## Installation

- Install with npm:

```bash
npm install inha-portal-sso-client --save
```

- Clone the repo:

```bash
git clone https://github.com/incalc/inha-portal-sso-client.git
```

## Usage

### API Documentation

See [API](https://incalc.github.io/inha-portal-sso-client/)

### Example

```ts
import { InhaAuth } from 'inha-portal-sso-client';

const client = await InhaAuth.init('12191765', 'P@ssw0rd!');
const info = await client.getStudentInfo();

console.log(info);
// {
//   sid: '12191765',
//   name: '박승재',
//   college: '공과대학',
//   department: '정보통신공학과',
//   grade: '2학년(재학)'
// }
```

## License

```text
Copyright (c) 2020 Seungjae Park

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Inha Portal SSO Client is licensed under the [MIT License](./LICENSE).
