import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, 'data', 'data.json')
const PRIORITIES = ['низкий', 'средний', 'высокий']

// --- работа с файлом ---
fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]')

const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
const writeData = (items) =>
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2))

// --- валидация ---
function validate(body = {}) {
  const title = String(body.title ?? '').trim()
  const description = String(body.description ?? '').trim()
  const dueDate = String(body.dueDate ?? '').trim()
  const { priority } = body
  const progress = Number(body.progress)

  if (!title) return { error: 'Название обязательно' }
  if (!description) return { error: 'Описание обязательно' }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate) || isNaN(Date.parse(dueDate)))
    return { error: 'Срок выполнения обязателен (формат ГГГГ-ММ-ДД)' }
  if (!PRIORITIES.includes(priority))
    return { error: `Приоритет должен быть: ${PRIORITIES.join(', ')}` }
  if (body.progress === '' || body.progress == null ||
      !Number.isFinite(progress) || progress < 0 || progress > 100)
    return { error: 'Выполнено на (%) должно быть числом от 0 до 100' }

  return { value: { title, description, dueDate, priority, progress } }
}

// --- приложение ---
const app = express()
app.use(cors())
app.use(express.json())

// GET /api/items?search=...&priority=...
app.get('/api/items', (req, res) => {
  const { search, priority } = req.query
  let items = readData()
  if (search) {
    const s = String(search).toLowerCase()
    items = items.filter((i) => i.title.toLowerCase().includes(s))
  }
  if (priority) items = items.filter((i) => i.priority === priority)
  res.json(items)
})

// GET /api/items/:id
app.get('/api/items/:id', (req, res) => {
  const item = readData().find((i) => i.id === Number(req.params.id))
  if (!item) return res.status(404).json({ error: 'Задача не найдена' })
  res.json(item)
})

// POST /api/items
app.post('/api/items', (req, res) => {
  const { error, value } = validate(req.body)
  if (error) return res.status(400).json({ error })
  const items = readData()
  const id = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1
  const item = { id, ...value }
  items.push(item)
  writeData(items)
  res.status(201).json(item)
})

// PUT /api/items/:id
app.put('/api/items/:id', (req, res) => {
  const items = readData()
  const index = items.findIndex((i) => i.id === Number(req.params.id))
  if (index === -1) return res.status(404).json({ error: 'Задача не найдена' })
  const { error, value } = validate(req.body)
  if (error) return res.status(400).json({ error })
  items[index] = { id: items[index].id, ...value }
  writeData(items)
  res.json(items[index])
})

// DELETE /api/items/:id
app.delete('/api/items/:id', (req, res) => {
  const items = readData()
  const index = items.findIndex((i) => i.id === Number(req.params.id))
  if (index === -1) return res.status(404).json({ error: 'Задача не найдена' })
  items.splice(index, 1)
  writeData(items)
  res.status(204).end()
})

const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0', () => console.log(`Server on port ${PORT}`))