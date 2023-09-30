# VK-BOT
A convenient chatbot for interacting with [poo.tomedu.ru](https://poo.tomedu.ru)

**EN**|**[ru](/README_ru.md)**

![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![WebStorm](https://img.shields.io/badge/webstorm-143?style=for-the-badge&logo=webstorm&logoColor=white&color=black)

## Installation

This project requires [Bun](https://bun.sh/) latest version.

Clone this repository:

```sh
git clone -b MainAlternative https://github.com/DIARY-SPO/vk-bot
```

Set up your copy of the project.
To do this, create a **.env** file and specify the main parameters in it:

| Name parameter | Example | Description | Required |
| -------------- | ------- | ----------- | -------- |
| SERVER_URL | https://poo.tomedu.ru/services/security | Address to the services of your diary | Yes |
| TOKEN | vkq.a.FdSdkdsDfj4ehnEhg... | A token from your community, where the bot will be located | Yes |
| LIMIT | 20 | Limiting api requests | NO |
| ENCRYPTED_KEY | jK309nA8XXk5IKm13XRkxJBXD15JHU8F | The key for encrypting passwords. Its length should be 32 characters exactly | YES |
| DATABASE_HOST | 192.168.0.112 | Database host | YES |
| DATABASE_PORT | 27017 | Database port | YES |
| DATABASE_NAME | bot | Database name | YES |

Example of a correctly filled file:

```dotenv
SERVER_URL=https://poo.tomedu.ru/services/security
TOKEN=vkq.a.FdSdkdsDfj4ehnEhg...
ENCRYPTED_KEY=jK309nA8XXk5IKm13XRkxJBXD15JHU8F
DATABASE_HOST=mongodb://localhost:27017
DATABASE_PORT=27017
DATABASE_NAME=bot
LIMIT=20
```

Your mongodb database should be running on 27017 port.

Install the dependencies, then start the server.

```sh
bun install
bun run --watch main.ts
```

------

This file can be supplemented/modified... Follow the changes!
