import auth from '@src/dblogic/login'
import { type DiaryUser } from '@types'
import { StepScene } from '@vk-io/scenes'
import { Keyboard, type MessageContext } from 'vk-io'

export default new StepScene('login', [
  async (context: MessageContext) => {
    const { session } = context
    const firstTime = session.isFirstTime ?? true
    const logout = session.isLogout
    const text = context.text

    if (logout) {
      await context.send('😑 Вы вышли из аккаунта')
      session.isLogout = false
      session.isFirstTime = false
    } else if (firstTime || !text) {
      await context.send('😺 Ого, ты здесь впервые ?')
      await context.send('😨 Для начала нужно авторизироваться.')
      session.isFirstTime = false
    }

    if (context.messagePayload) {
      switch (context.messagePayload.command) {
        case 'auth': { await context.scene.step.next(); return }
        case 'info_bot': await context.send('Тут должно быть инфо о боте...')
      }
    }

    await context.send({
      message: 'Вот основные команды:',
      keyboard: Keyboard.builder().textButton({
        label: 'Авторизация',
        payload: {
          command: 'auth'
        },
        color: Keyboard.PRIMARY_COLOR
      }).row()
        .textButton({
          label: 'Информация о боте',
          payload: {
            command: 'info_bot'
          },
          color: Keyboard.SECONDARY_COLOR
        }).oneTime()
    })
  },

  async (context: MessageContext) => {
    const firstTime = context.scene.step.firstTime
    const text = context.text ?? ''
    const keyboard = Keyboard.builder().textButton({
      label: 'На главную...',
      payload: { command: 'goHome' },
      color: Keyboard.SECONDARY_COLOR
    }).oneTime()
    if (context?.messagePayload?.command === 'goHome') return context.scene.step.previous()

    // Проверяем логин
    if (!context.scene.state.login && firstTime) {
      await context.send({ message: '👤 Введите Логин:', keyboard })
    } else if (!context.scene.state.login) {
      // const fio = text.split('-')
      if (text.length >= 5 && text.length <= 20) {
        await context.send('Логин принят ✅')
        context.scene.state.login = text
        await context.scene.step.next()
      } else {
        await context.send('❗ Вы ввели неверный логин')
        await context.send('⛱ Логин должен быть от 5 до 20 символов')
        await context.send({ message: '👤 Повторите попытку:', keyboard })
      }
    }

    // return context.scene.step.next(); // Выходим из сцены
  },

  async (context: MessageContext) => {
    const firstTime = context.scene.step.firstTime
    const text = context.text ?? ''
    const keyboard = Keyboard.builder().textButton({
      label: 'Изменить Логин',
      payload: { command: 'editLogin' },
      color: Keyboard.SECONDARY_COLOR
    }).oneTime()
    if (context?.messagePayload?.command === 'editLogin') {
      context.scene.state.login = undefined
      context.scene.state.password = undefined
      return context.scene.step.previous()
    }

    // Проверяем пароль
    if (!context.scene.state.password && firstTime) {
      await context.send({ message: '✏ Введите Пароль:', keyboard })
    } else if (!context.scene.state.password) {
      if (text.length >= 5) {
        await context.send('Пароль принят ✅')
        context.scene.state.password = text
        await context.scene.step.next()
      } else {
        await context.send('❗ Вы ввели неверный пароль')
        await context.send('⛱ Пароль должен быть не короче 5 символов')
        await context.send({ message: '✏ Повторите попытку:', keyboard })
      }
    }

    // return context.scene.step.next(); // Выходим из сцены
  },
  async (context: MessageContext) => {
    const { session } = context
    // const firstTime = context.scene.step.firstTime
    // const text = context.text ?? ''
    const retryKeyboard = Keyboard.builder().textButton(
      {
        label: 'Повторить попытку',
        payload: {
          command: 'retry'
        }
      }).inline()

    if (context?.messagePayload?.command === 'rewriteAuthData') {
      // FIXME: временно
      return
    }

    const message = await context.send('😼 Авторизирую...')
    const password = context.scene.state.password
    const login = context.scene.state.login

    const res = await auth(login, password, context.senderId)

    switch (res) {
      case 1: {
        await message.editMessage({ message: 'Произошла неизвестная ошибка...', keyboard: retryKeyboard })
        return
      }
      case 401: {
        await message.editMessage({ message: 'Неверный Логин или Пароль!' })
        context.scene.state.login = undefined
        context.scene.state.password = undefined
        await context.scene.step.go(1)
        return
      }
      case 501: {
        await message.editMessage({ message: 'Сервер дневника упал...', keyboard: retryKeyboard })
        return
      }
      default: {
        const user = res as DiaryUser
        session.isAuth = true
        session.diaryUser = user
        await message.editMessage({ message: `🙃 Привет, ${user.firstname}! Ты успешно авторизирован.` })
        context.scene.enter('home')
      }
    }
  }
])
