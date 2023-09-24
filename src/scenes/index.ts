import scenes from '@src/init/scenes'
import c      from 'colors'

const logger        = (context, next) => {
    const type = (context.subTypes == "message_edit" ? 'edit ': 'write') + `(messageId: ${context.id})`;
    const text = `[${context.senderId}]\t${type}=> `
    console.log(c.magenta(`[${new Date().toUTCString()}]\t`), context.senderId < 0 ? c.red(text) : c.green(text), context.text)
    next();
}
const scenesHandler = (context, next) => {
    // Условия захода в сцены
    const isAuth = false;                           // Авторизирован ли пользователь ?
    if (!isAuth) {
        return context.scene.enter('registration'); 
    } else {
        return context.scene.enter('home');
    }
    // Не некстим, т.к. последний обработчик
}

export {logger, scenesHandler, scenes};