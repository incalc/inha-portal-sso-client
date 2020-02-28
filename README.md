# Inha Portal SSO Client

> Inha Univ. Portal Single Sign-On Client

[![NPM](https://img.shields.io/npm/v/inha-portal-sso-client?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/inha-portal-sso-client) [![NODE](https://img.shields.io/node/v/inha-portal-sso-client?style=for-the-badge&logo=node.js)](https://nodejs.org) [![DOWNLOADS](https://img.shields.io/npm/dt/inha-portal-sso-client?style=for-the-badge)](https://www.npmjs.com/package/inha-portal-sso-client) [![LICENSE](https://img.shields.io/npm/l/inha-portal-sso-client?style=for-the-badge)](./LICENSE)

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

const client = await InhaAuth.init('12191234', 'P@ssw0rd!');
const info = await client.getStudentInfo();

console.log(info);
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
