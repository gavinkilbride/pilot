import { useEffect, useState } from 'react'
import './App.css'

interface Item {
  id: number
  title: string
  description: string | null
  isComplete: boolean
  createdAt: string
  updatedAt: string | null
}

const API_BASE = import.meta.env.VITE_API_URL ?? ''

function App() {
  const [items, setItems] = useState<Item[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/items`)
      const data = await res.json()
      setItems(data)
    } catch (err) {
      console.error('Failed to fetch items:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      const res = await fetch(`${API_BASE}/api/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: description || null, isComplete: false }),
      })
      if (res.ok) {
        setTitle('')
        setDescription('')
        fetchItems()
      }
    } catch (err) {
      console.error('Failed to add item:', err)
    }
  }

  const toggleComplete = async (item: Item) => {
    try {
      await fetch(`${API_BASE}/api/items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, isComplete: !item.isComplete }),
      })
      fetchItems()
    } catch (err) {
      console.error('Failed to update item:', err)
    }
  }

  const deleteItem = async (id: number) => {
    try {
      await fetch(`${API_BASE}/api/items/${id}`, { method: 'DELETE' })
      fetchItems()
    } catch (err) {
      console.error('Failed to delete item:', err)
    }
  }

  const startEditing = (item: Item) => {
    setEditingId(item.id)
    setEditTitle(item.title)
    setEditDescription(item.description ?? '')
  }

  const saveEdit = async (item: Item) => {
    try {
      await fetch(`${API_BASE}/api/items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, title: editTitle, description: editDescription || null }),
      })
      setEditingId(null)
      fetchItems()
    } catch (err) {
      console.error('Failed to update item:', err)
    }
  }

  return (
    <div className="app">
      <h1>Pilot Items</h1>

      <form onSubmit={addItem} className="add-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p className="empty">No items yet. Add one above.</p>
      ) : (
        <ul className="item-list">
          {items.map((item) => (
            <li key={item.id} className={item.isComplete ? 'complete' : ''}>
              {editingId === item.id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Description"
                  />
                  <div className="actions">
                    <button onClick={() => saveEdit(item)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="item-content" onClick={() => toggleComplete(item)}>
                    <span className="checkbox">{item.isComplete ? '✓' : '○'}</span>
                    <div>
                      <strong>{item.title}</strong>
                      {item.description && <p className="desc">{item.description}</p>}
                    </div>
                  </div>
                  <div className="actions">
                    <button onClick={() => startEditing(item)}>Edit</button>
                    <button className="delete" onClick={() => deleteItem(item.id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
