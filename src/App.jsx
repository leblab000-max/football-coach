import { useState, useEffect } from "react"
import axios from "axios"

const API = "http://127.0.0.1:8000"

function App() {
  const [exercises, setExercises] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: "", category: "Передачи", description: "",
    coaching_points: "", equipment: "", difficulty: "medium",
    age_min: 6, age_max: 14, duration_minutes: 10,
    min_players: 4, max_players: 12
  })

  const loadExercises = () => {
    axios.get(`${API}/exercises/`).then(res => setExercises(res.data))
  }

  useEffect(() => { loadExercises() }, [])

  const handleSubmit = () => {
    axios.post(`${API}/exercises/`, form).then(() => {
      loadExercises()
      setShowForm(false)
    })
  }

  const handleDelete = (id) => {
    axios.delete(`${API}/exercises/${id}`).then(() => loadExercises())
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20, fontFamily: "sans-serif" }}>
      <h1>⚽ Football Coach</h1>
      <p style={{ color: "#666" }}>Приложение для детских футбольных тренеров</p>
      <hr />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>База упражнений ({exercises.length})</h2>
        <button onClick={() => setShowForm(!showForm)} style={{
          background: "#2563eb", color: "white", border: "none",
          padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontSize: 14
        }}>
          {showForm ? "Отмена" : "+ Добавить упражнение"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <h3>Новое упражнение</h3>
          <input placeholder="Название" value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            style={{ width: "100%", padding: 8, marginBottom: 8, borderRadius: 6, border: "1px solid #ddd" }} />
          <select value={form.category}
            onChange={e => setForm({...form, category: e.target.value})}
            style={{ width: "100%", padding: 8, marginBottom: 8, borderRadius: 6, border: "1px solid #ddd" }}>
            {["Передачи","Ведение мяча","Удары","Координация","Скорость","Игра 1v1","ОФП"].map(c =>
              <option key={c}>{c}</option>
            )}
          </select>
          <textarea placeholder="Описание упражнения" value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            style={{ width: "100%", padding: 8, marginBottom: 8, borderRadius: 6, border: "1px solid #ddd", height: 80 }} />
          <input placeholder="Инвентарь (мячи, конусы...)" value={form.equipment}
            onChange={e => setForm({...form, equipment: e.target.value})}
            style={{ width: "100%", padding: 8, marginBottom: 8, borderRadius: 6, border: "1px solid #ddd" }} />
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input type="number" placeholder="Возраст от" value={form.age_min}
              onChange={e => setForm({...form, age_min: +e.target.value})}
              style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
            <input type="number" placeholder="Возраст до" value={form.age_max}
              onChange={e => setForm({...form, age_max: +e.target.value})}
              style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
            <input type="number" placeholder="Минут" value={form.duration_minutes}
              onChange={e => setForm({...form, duration_minutes: +e.target.value})}
              style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
          </div>
          <button onClick={handleSubmit} style={{
            background: "#16a34a", color: "white", border: "none",
            padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontSize: 14
          }}>
            Сохранить упражнение
          </button>
        </div>
      )}

      {exercises.length === 0 && <p style={{ color: "#999" }}>Упражнений пока нет. Добавьте первое!</p>}

      {exercises.map(ex => (
        <div key={ex.id} style={{
          border: "1px solid #e2e8f0", borderRadius: 12,
          padding: 16, marginBottom: 12, background: "white"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ margin: 0 }}>{ex.name}</h3>
            <button onClick={() => handleDelete(ex.id)} style={{
              background: "none", border: "none", color: "#ef4444",
              cursor: "pointer", fontSize: 18
            }}>🗑</button>
          </div>
          <p style={{ color: "#6b7280", margin: "4px 0" }}>
            📂 {ex.category} · ⏱ {ex.duration_minutes} мин · 
            👥 {ex.min_players}-{ex.max_players} игроков · 
            🎂 {ex.age_min}-{ex.age_max} лет
          </p>
          {ex.equipment && <p style={{ color: "#6b7280", margin: "4px 0" }}>🎒 {ex.equipment}</p>}
          <p style={{ margin: "8px 0 0" }}>{ex.description}</p>
        </div>
      ))}
    </div>
  )
}

export default App