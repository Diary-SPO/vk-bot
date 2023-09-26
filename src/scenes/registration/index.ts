import { StepScene } from '@vk-io/scenes';
import { Context, Keyboard } from 'vk-io';

export default new StepScene('registration', [
    async (context) => {
        const firstTime = context.scene.step.firstTime
        const text      = context.text;
        if (firstTime|| !text) {
            await context.send('😺 Ого, ты здесь впервые ?');
            await context.send('😨 Для начала нужно авторизироваться.');
        }
        if (context.messagePayload) {
            switch (context.messagePayload.command) {
                case 'auth': return context.scene.step.next(); break;
                case 'info_bot': await context.send('Тут должно быть инфо о боте...')
            }
        }
        await context.send(
            {
                message: 'Вот основные комманды:',
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
            });
    },
    async (context) => {
        const firstTime = context.scene.step.firstTime
        const text      = context.text;

        // Проверяем логин
        if (!context.scene.state.login && firstTime) {
            await context.send('👤 Введите Логин:'); return;
        } else if (!context.scene.state.login) {
            const fio = text.split('-');
            if (fio.length == 2 && fio[1].length == 2) {
                await context.send('Логин принят ✅')
                context.scene.state.login = text;
                return context.scene.step.next();
            } else {
                await context.send('❗ Вы ввели неверный логин')
                await context.send('⛱ Пример правильного ввода: familiya-io')
                await context.send('👤 Повторите попытку:'); return
            }
        }
        
        //return context.scene.step.next(); // Выходим из сцены
    }
])