import { marks } from "@src/dblogic/marks";
import { StepScene } from "@vk-io/scenes";
import { Keyboard, MessageContext } from "vk-io";
import { Numbers } from "@src/types";

export default new StepScene('marks', [
    async (context: MessageContext) => {
        const {session} = context
        const user = session.diaryUser

        let message = '???'

        /* TODO: Красивенько в функции раскидать и сделать шаблоны
         * Также сделать формирование сообщения выховом другой функции из ./messageGenerator.ts
         */
        switch(context?.messagePayload?.command) {
            // Вернуться на главную
            case 'goHome': return await context.scene.enter('home')
            // Оценки по всем предметам
            case 'allSubjects': {
                const subjectMarks = await marks(user.id, user.cookie, false)
                message = `${Object.values(subjectMarks ?? []).map(subject => {
                    if (subject.marks.length > 0) {
                        return `${subject.subjectName}\n`
                             + `${subject.marks.join(', ')}`
                    }
                    return ''
                }).join('\n\n')}`
            } break
            // Краткая статистка по успеваемости
            case 'statistics': {
                const subjectMarks = await marks(user.id, user.cookie, false)
                message =
                  `📊 Статистика успеваемости\n\n`
                + `📍 Количество оценок\n`
                + `${
                    typeof subjectMarks === 'number' || !subjectMarks ? 'Ошибка загружки 😒' :
                    (
                        subjectMarks.length === 0 ? 'Оу, пусто. Так держать! 🤠' :
                        (
                            `${
                                (() => {
                                    const marks: {[key: string]: number} = {}
                                    let summ = 0
                                    let count = 0
                                    subjectMarks.forEach(subject => {
                                        subject.marks.forEach(mark => {
                                            summ += mark.length === 1 ? Number(mark) : 0
                                            count++
                                            if (marks?.[mark] != undefined) {
                                                marks[mark]++
                                                return
                                            }
                                            marks[mark] = 1
                                        })
                                    })
                                    return Object.keys(marks).sort().reverse().map(type => {
                                        return `${Numbers[Number(type)]} → ${marks[type]}`
                                    }).join('\n')
                                    + `\n\n🎳 Средний балл: ${(summ/count).toFixed(3)}`
                                })()
                            }`
                        )
                    )
                }`
            } break
            // По дефолту отдаём последние оценки
            default: {
                message = 'О последних оценках пока что ничего не известно'
            }
        }
        return await context.send({
            message,
            keyboard: Keyboard.builder()
            .textButton({
                label: '💼 Все оценки',
                payload: {
                    command: 'allSubjects'
                }
            })
            .textButton({
                label: 'Статистика 📊',
                payload: {
                    command: 'statistics'
                }
            })
            .row()
            .textButton({
                label: 'Назад',
                payload: {
                    command: 'goHome'
                },
                color: Keyboard.NEGATIVE_COLOR
            })
          })
    }
])