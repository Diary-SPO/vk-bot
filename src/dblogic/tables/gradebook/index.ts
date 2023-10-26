import { type GradebookDB, type RequiredDB, type Schedule, type TaskDB, type ThemeDB } from '@src/types'
import { type Gradebook } from 'diary-shared'
import { getTaskTypeId, lessonTypeGetId } from '..'
import { createQueryBuilder } from '@src/dblogic/sql'

const gradebookSave = async (gb: Gradebook, sc: Schedule, diaryUserId: number): Promise<void> => {
  if (!sc?.id || !sc.groupId) return

  const actualGradebook: GradebookDB = {
    scheduleId: sc.id,
    lessonTypeId: await lessonTypeGetId(gb.lessonType),
    id: gb.id
  }

  const gradebookQueryBuilder = createQueryBuilder<GradebookDB>()
    .from('gradebook')
    .select('*')
    .where(`"id" = '${gb.id}'`)
  const gradebookExisting = await gradebookQueryBuilder.first()

  // 1. Обрабатываем само "тело" --- Gradebook
  if (gradebookExisting) {
    // Если градебук существует
    if (gradebookExisting.lessonTypeId !== actualGradebook.lessonTypeId ||
            gradebookExisting.scheduleId !== actualGradebook.scheduleId) {
      // обновляем
      const update = await gradebookQueryBuilder.update(actualGradebook)
      if (!update) {
        throw new Error('Error update gradebook')
      }
      actualGradebook.id = update.id
    } else {
      // Если не надо обновлять, то просто записываем идишник
      actualGradebook.id = gradebookExisting.id
    }
  } else {
    // Иначе добавляем
    const insert = await gradebookQueryBuilder.insert(actualGradebook)
    if (!insert) {
      throw new Error('Error insert gradebook')
    }
    actualGradebook.id = insert.id
  }

  // 2. Обрабатываем темы
  if (gb?.themes) {
    const themes = structuredClone(gb.themes)
    const themeQueryBuilder = createQueryBuilder<ThemeDB>().from('theme').select('*').where(`"gradebookId" = ${actualGradebook.id}`)
    const existingThemes = await themeQueryBuilder.all()

    // Отсеиваем те, которые уже добавлены в базу
    if (existingThemes) {
      for (let i = 0; i < themes.length; i++) {
        const theme = themes[i]

        for (let j = 0; j < existingThemes.length; j++) {
          const oldTheme = existingThemes[j]
          if (theme === oldTheme.description) {
            themes.splice(i, 1)
            existingThemes.splice(j, 1)
            // Элементы сдвинулись после "удаления", поэтому подгоняем индекс
            i--
            j--
          }
        }
      }

      // Теперь у нас в themes те темы, которые надо добавить, а в existingThemes - удалить
      // (такой перебор экономит количество обращений к БД :))
      // Удаляем старые записи (темы)
      for (let i = 0; i < existingThemes.length; i++) {
        themeQueryBuilder
          .where(`description = '${existingThemes[i].description}' and "gradebookId" = '${actualGradebook.id}'`)
          .delete()
          .catch((err) => { console.log(`Error delete theme: ${err}`) })
      }
    }

    // Добавляем новые темы
    for (let i = 0; i < themes.length; i++) {
      themeQueryBuilder
        .insert({
          description: themes[i],
          gradebookId: actualGradebook.id
        })
        .catch((err) => { console.log(`Error insert theme: ${err}`) })
    }
  }

  // 3. Обрабатываем таски
  if (gb?.tasks) {
    const tasksQueryBuilder = createQueryBuilder<TaskDB>()
      .from('task')
      .select('*')
      .where(`"gradebookId" = ${actualGradebook.id}`)

    const existingTasks = await tasksQueryBuilder.all()
    const tasks = structuredClone(gb.tasks)

    if (existingTasks) {
      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i]

        for (let j = 0; j < existingTasks.length; j++) {
          const oldTask = existingTasks[j]
          if (task.topic === oldTask.topic) {
            tasks.splice(i, 1)
            existingTasks.splice(j, 1)
            i--
            j--
          }
        }
      }

      // Удаляем старые таски (зависимые записи удалятся каскадно)
      for (let i = 0; i < existingTasks.length; i++) {
        const task = existingTasks[i]
        tasksQueryBuilder
          .where(`id = ${task.id}`)
          .delete()
          .catch((err) => { console.log(`Error delete task: ${err}`) })
      }
    }

    // Заносим новые таски
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i]
      await tasksQueryBuilder.insert({
        id: task.id,
        gradebookId: actualGradebook.id,
        taskTypeId: await getTaskTypeId(task.type),
        topic: task.topic
      })

      // Заносим посещаемость
      const requiredsQueryBuilder = createQueryBuilder<RequiredDB>()
        .from('requireds')
        .select('*')
        .where(`"taskId" = ${task.id} and "diaryUserId" = ${diaryUserId}`)

      const actualRequired: RequiredDB = {
        diaryUserId,
        taskId: task.id,
        isRequired: task.isRequired
      }

      const requiredsExisting = await requiredsQueryBuilder.first()
      if (!requiredsExisting) {
        // TODO: Можно добавить проверку и делать ошибку, если всё не Ок.
        // Нам оно надо, если это не критично ...?
        await requiredsQueryBuilder.insert(actualRequired)
        continue
      }
      if (requiredsExisting.isRequired !== task.isRequired) {
        await requiredsQueryBuilder.update(actualRequired)
      }
    }
  }
}

export { gradebookSave }
