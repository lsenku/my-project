import { useState } from 'react'

const EMPTY = { title: '', description: '', dueDate: '', priority: 'средний', progress: 0 }

function ItemForm({ initial, onSubmit, onCancel }) {
  const [values, setValues] = useState(initial ?? EMPTY)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [saving, setSaving] = useState(false)

  const change = (e) => setValues({ ...values, [e.target.name]: e.target.value })

  function validate() {
    const e = {}
    if (!values.title.trim()) e.title = 'Введите название'
    if (!values.description.trim()) e.description = 'Введите описание'
    if (!values.dueDate) e.dueDate = 'Укажите срок'
    const p = Number(values.progress)
    if (values.progress === '' || !Number.isFinite(p) || p < 0 || p > 100)
      e.progress = 'Число от 0 до 100'
    return e
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    setServerError('')
    if (Object.keys(e).length > 0) return

    setSaving(true)
    try {
      await onSubmit({ ...values, progress: Number(values.progress) })
      if (!initial) setValues(EMPTY)
    } catch (err) {
      setServerError(err.message) // ошибка, пришедшая с сервера
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2 style={{ gridColumn: '1 / -1', margin: 0 }}>
        {initial ? '✏️ Редактирование задачи' : '➕ Новая задача'}
      </h2>

      <div className="field full">
        <label htmlFor="title">Название</label>
        <input id="title" name="title" placeholder="Например: Сделать ДЗ" value={values.title} onChange={change} />
        {errors.title && <span className="error">{errors.title}</span>}
      </div>

      <div className="field full">
        <label htmlFor="description">Описание</label>
        <input id="description" name="description" placeholder="Что нужно сделать" value={values.description} onChange={change} />
        {errors.description && <span className="error">{errors.description}</span>}
      </div>

      <div className="field">
        <label htmlFor="dueDate">Срок выполнения</label>
        <input id="dueDate" type="date" name="dueDate" value={values.dueDate} onChange={change} />
        {errors.dueDate && <span className="error">{errors.dueDate}</span>}
      </div>

      <div className="field">
        <label htmlFor="priority">Приоритет</label>
        <select id="priority" name="priority" value={values.priority} onChange={change}>
          <option value="низкий">Низкий</option>
          <option value="средний">Средний</option>
          <option value="высокий">Высокий</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="progress">Выполнено на (%)</label>
        <input id="progress" type="number" name="progress" min="0" max="100" value={values.progress} onChange={change} />
        {errors.progress && <span className="error">{errors.progress}</span>}
      </div>

      {serverError && <p className="server-error">Сервер: {serverError}</p>}

      <div className="actions">
        <button type="submit" disabled={saving}>
          {initial ? 'Сохранить' : 'Добавить'}
        </button>
        {initial && (
          <button type="button" className="secondary" onClick={onCancel}>
            Отмена
          </button>
        )}
      </div>
    </form>
  )
}

export default ItemForm