import ItemCard from './ItemCard'

function ItemList({ items, onEdit, onDelete }) {
  if (items.length === 0) return <p className="status">Задач нет</p>
  return items.map((item) => (
    <ItemCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
  ))
}

export default ItemList