import { StepScene } from '@vk-io/scenes';

export default new StepScene('home', [
    (context) => {
        if (context.scene.step.firstTime || !context.text) {
            return context.send('Вот меню: ');
        }

        switch (context.text) {
            default: return context.send('Выбери действие из меню:');
        }
    }
])