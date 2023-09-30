# VK-BOT
Удобный чат-бот для взаимодействия с [poo.tomedu.ru](https://poo.tomedu.ru)

**[en](/README.md)**|**RU**

![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![WebStorm](https://img.shields.io/badge/webstorm-143?style=for-the-badge&logo=webstorm&logoColor=white&color=black)

## Установка

Этот проект требует [Bun](https://bun.sh/) последней версии.

Клонируйте этот репозиторий:

```sh
git clone -b MainAlternative https://github.com/DIARY-SPO/vk-bot
```

Настройте свою копию проекта.
Для этого создайте файл **.env** и укажите в нем основные параметры:

| Имя параметра | Пример | Описание | Обязательно |
| -------------- | ------- | ----------- | -------- |
| SERVER_URL | https://poo.tomedu.ru/services/security | Адрес до сервисов вашего дневника | Да |
| TOKEN | vkq.a.FdSdkdsDfj4ehnEhg... | Токен от вашего сообщества, где будет располагаться бот | Да |
| LIMIT | 20 | Лимит запрсоов к API | Нет |
| ENCRYPTED_KEY | jK309nA8XXk5IKm13XRkxJBXD15JHU8F | Ключ для шифрования паролей. Его длина должна составлять ровно 32 символа | Да |
| DATABASE_HOST | 192.168.0.112 | Хост базы данных | Да |
| DATABASE_PORT | 27017 | Порт от базы данных | Да |
| DATABASE_NAME | bot | Имя базы данных | Да |

Пример корректно заполненного файла:

```sh
SERVER_URL=https://poo.tomedu.ru/services/security
TOKEN=vkq.a.FdSdkdsDfj4ehnEhg...
ENCRYPTED_KEY=jK309nA8XXk5IKm13XRkxJBXD15JHU8F
DATABASE_HOST=192.168.0.112
DATABASE_PORT=27017
DATABASE_NAME=bot
LIMIT=20
```

Ваша база данных mongodb должна работать на порту 27017.

Установите зависимости, затем запустите сервер.

```sh
bun install
bun run --watch main.ts
```

------

Этот файл может быть дополнен/изменен... Следите за обновлениями!
