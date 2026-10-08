import { useEffect, useState } from 'react'
import Header from './components/Header'
import Filters from './components/Filters'
import ItemForm from './components/ItemForm'
import ItemList from './components/ItemList'
import { getItems, createItem, updateItem, deleteItem } from './api'

function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [priority, setPriority] = useState('')
  const [editing, setEditing] = useState(null)

  async function load() {
    setLoading(true)
    setError('')
    try {
      setItems(await getItems({ search, priority }))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [search, priority])

  // ошибку пробрасываем дальше, чтобы форма показала её пользователю
  async function handleSave(data) {
    if (editing) await updateItem(editing.id, data)
    else await createItem(data)
    setEditing(null)
    await load()
  }

  async function handleDelete(id) {
    if (!confirm('Удалить задачу?')) return
    try {
      await deleteItem(id)
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

    return (
    <div className="container">
      <Header />

      <div className="panel">
        <ItemForm
          key={editing?.id ?? 'new'}
          initial={editing}
          onSubmit={handleSave}
          onCancel={() => setEditing(null)}
        />
      </div>

      <div className="panel">
        <Filters
          search={search}
          priority={priority}
          onSearch={setSearch}
          onPriority={setPriority}
        />
      </div>

      {loading && <p className="status">Загрузка…</p>}
      {error && <p className="status error-box">Ошибка: {error}</p>}
      {!loading && !error && (
        <ItemList items={items} onEdit={setEditing} onDelete={handleDelete} />
      )}
    </div>
  )
}

export default App