const PRIORITY_CLASS = { низкий: 'low', средний: 'medium', высокий: 'high' }

function formatDate(iso) {
  return iso.split('-').reverse().join('.') // 2026-10-20 → 20.10.2026
}

function ItemCard({ item, onEdit, onDelete }) {
  const level = PRIORITY_CLASS[item.priority]

  return (
    <div className={`card ${level}`}>
      <div className="card-top">
        <h3>{item.title}</h3>
        <span className={`badge ${level}`}>{item.priority}</span>
      </div>

      <p className="desc">{item.description}</p>
      <p className="meta">
        📅 Срок: {formatDate(item.dueDate)} · Выполнено: {item.progress}%
      </p>

      <div className="progress">
        <div className="progress-bar" style={{ width: `${item.progress}%` }} />
      </div>

      <div className="card-actions">
        <button className="secondary" onClick={() => onEdit(item)}>
          Редактировать
        </button>
        <button className="danger" onClick={() => onDelete(item.id)}>
          Удалить
        </button>
      </div>
    </div>
  )
}

export default ItemCard