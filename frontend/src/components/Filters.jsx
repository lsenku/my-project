function Filters({ search, priority, onSearch, onPriority }) {
  return (
    <div className="filters">
      <input
        placeholder="🔍 Поиск по названию"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
      <select value={priority} onChange={(e) => onPriority(e.target.value)}>
        <option value="">Все приоритеты</option>
        <option value="низкий">Низкий</option>
        <option value="средний">Средний</option>
        <option value="высокий">Высокий</option>
      </select>
    </div>
  )
}

export default Filters