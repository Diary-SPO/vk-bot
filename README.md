# VK-BOT
A convenient chatbot for interacting with [poo.tomedu.ru](https://poo.tomedu.ru)'

![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![WebStorm](https://img.shields.io/badge/webstorm-143?style=for-the-badge&logo=webstorm&logoColor=white&color=black)

## Installation

Dillinger requires [Bun](https://bun.sh/) latest version.

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
| ENCRYPTED_KEY | MySupperPassTrue | The key for encrypting passwords. Its length should be 16, 24 or 32 characters exactly | No |

Example of a correctly filled file:

```sh
SERVER_URL=https://poo.tomedu.ru/services/security
TOKEN=vkq.a.FdSdkdsDfj4ehnEhg...
# ENCRYPTED_KEY=OPTIONALE_KEY!!!
```

Your mongodb database should be running on 192.168.0.112:27017. Create a **bot** table with the ***uservks*** table in advance.

Install the dependencies and devDependencies and start the server.

```sh
bun install
bun .
```

------

This file can be supplemented/modified... Follow the changes!
