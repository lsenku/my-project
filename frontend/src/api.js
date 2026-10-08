const BASE = '/api/items'

async function request(url, options) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (res.status === 204) return null
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error || `Ошибка сервера (${res.status})`)
  return data
}

export function getItems({ search, priority } = {}) {
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (priority) params.set('priority', priority)
  return request(`${BASE}?${params}`)
}

export const createItem = (item) =>
  request(BASE, { method: 'POST', body: JSON.stringify(item) })

export const updateItem = (id, item) =>
  request(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(item) })

export const deleteItem = (id) => request(`${BASE}/${id}`, { method: 'DELETE' })