import { useState, useEffect } from "react"
import axios from "axios"

const API = "http://127.0.0.1:8000"
const CATEGORIES = ["Передачи","Ведение мяча","Удары","Координация","Скорость","Игра 1v1","ОФП"]
const GOALS = ["Передачи","Ведение мяча","Удары","Координация","Скорость","Игра 1v1","ОФП"]

function App() {
  const [page, setPage] = useState("exercises")
  const [exercises, setExercises] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [training, setTraining] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [form, setForm] = useState({
    name: "", category: "Передачи", description: "",
    coaching_points: "", equipment: "", difficulty: "medium",
    age_min: 6, age_max: 14, duration_minutes: 10,
    min_players: 4, max_players: 12
  })
  const [trainForm, setTrainForm] = useState({
    age: 10, players: 12, duration: 60,
    goals: ["Передачи"], level: "medium", equipment: "мячи, конусы"
  })

  const loadExercises = () => {
    axios.get(`${API}/exercises/`).then(res => setExercises(res.data))
  }

  useEffect(() => { loadExercises() }, [])

  const handleSubmit = () => {
    if (!form.name) return alert("Введите название!")
    axios.post(`${API}/exercises/`, form).then(() => {
      loadExercises()
      setShowForm(false)
    })
  }

  const handleDelete = (id) => {
    if (confirm("Удалить упражнение?"))
      axios.delete(`${API}/exercises/${id}`).then(() => loadExercises())
  }

  const generateTraining = () => {
    setGenerating(true)
    axios.post(`${API}/training/generate`, trainForm)
      .then(res => { setTraining(res.data); setGenerating(false) })
      .catch(() => setGenerating(false))
  }

  const toggleGoal = (g) => {
    const goals = trainForm.goals.includes(g)
      ? trainForm.goals.filter(x => x !== g)
      : [...trainForm.goals, g]
    setTrainForm({...trainForm, goals})
  }

  return (
    <div>
      <nav className="navbar navbar-dark bg-success px-4">
        <span className="navbar-brand fw-bold">⚽ Football Coach</span>
        <div className="d-flex gap-2">
          <button onClick={() => setPage("exercises")}
            className={`btn btn-sm ${page === "exercises" ? "btn-light" : "btn-outline-light"}`}>
            Упражнения
          </button>
          <button onClick={() => setPage("training")}
            className={`btn btn-sm ${page === "training" ? "btn-light" : "btn-outline-light"}`}>
            Тренировка
          </button>
        </div>
      </nav>

      <div className="container mt-4" style={{maxWidth: 800}}>

        {page === "exercises" && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">База упражнений <span className="badge bg-success">{exercises.length}</span></h4>
              <button onClick={() => setShowForm(!showForm)} className="btn btn-success btn-sm">
                {showForm ? "✕ Отмена" : "+ Добавить"}
              </button>
            </div>

            {showForm && (
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Новое упражнение</h5>
                  <div className="mb-2">
                    <input placeholder="Название упражнения" value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      className="form-control form-control-sm" />
                  </div>
                  <div className="mb-2">
                    <select value={form.category}
                      onChange={e => setForm({...form, category: e.target.value})}
                      className="form-select form-select-sm">
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="mb-2">
                    <textarea placeholder="Описание" value={form.description}
                      onChange={e => setForm({...form, description: e.target.value})}
                      className="form-control form-control-sm" rows={3} />
                  </div>
                  <div className="mb-2">
                    <input placeholder="Инвентарь" value={form.equipment}
                      onChange={e => setForm({...form, equipment: e.target.value})}
                      className="form-control form-control-sm" />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col">
                      <label className="form-label small">Возраст от</label>
                      <input type="number" value={form.age_min}
                        onChange={e => setForm({...form, age_min: +e.target.value})}
                        className="form-control form-control-sm" />
                    </div>
                    <div className="col">
                      <label className="form-label small">Возраст до</label>
                      <input type="number" value={form.age_max}
                        onChange={e => setForm({...form, age_max: +e.target.value})}
                        className="form-control form-control-sm" />
                    </div>
                    <div className="col">
                      <label className="form-label small">Минут</label>
                      <input type="number" value={form.duration_minutes}
                        onChange={e => setForm({...form, duration_minutes: +e.target.value})}
                        className="form-control form-control-sm" />
                    </div>
                  </div>
                  <button onClick={handleSubmit} className="btn btn-success w-100">
                    Сохранить упражнение
                  </button>
                </div>
              </div>
            )}

            {exercises.length === 0 && (
              <div className="text-center py-5 text-muted">
                <p className="fs-1">📋</p>
                <p>Упражнений пока нет</p>
              </div>
            )}

            <div className="d-flex flex-column gap-3">
              {exercises.map(ex => (
                <div key={ex.id} className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h6 className="card-title mb-2">{ex.name}</h6>
                        <div className="d-flex flex-wrap gap-1 mb-2">
                          <span className="badge bg-success">{ex.category}</span>
                          <span className="badge bg-secondary">{ex.duration_minutes} мин</span>
                          <span className="badge bg-secondary">{ex.min_players}-{ex.max_players} игроков</span>
                          <span className="badge bg-secondary">{ex.age_min}-{ex.age_max} лет</span>
                          {ex.equipment && <span className="badge bg-light text-dark">{ex.equipment}</span>}
                        </div>
                        {ex.description && <p className="card-text small text-muted mb-0">{ex.description}</p>}
                      </div>
                      <button onClick={() => handleDelete(ex.id)} className="btn btn-link text-danger p-0 ms-2">🗑</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {page === "training" && (
          <>
            <h4 className="mb-3">Генератор тренировки</h4>
            <div className="card mb-4">
              <div className="card-body">
                <div className="row g-3 mb-3">
                  <div className="col">
                    <label className="form-label small">Возраст</label>
                    <input type="number" value={trainForm.age}
                      onChange={e => setTrainForm({...trainForm, age: +e.target.value})}
                      className="form-control form-control-sm" />
                  </div>
                  <div className="col">
                    <label className="form-label small">Игроков</label>
                    <input type="number" value={trainForm.players}
                      onChange={e => setTrainForm({...trainForm, players: +e.target.value})}
                      className="form-control form-control-sm" />
                  </div>
                  <div className="col">
                    <label className="form-label small">Минут</label>
                    <input type="number" value={trainForm.duration}
                      onChange={e => setTrainForm({...trainForm, duration: +e.target.value})}
                      className="form-control form-control-sm" />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small">Цели тренировки</label>
                  <div className="d-flex flex-wrap gap-2">
                    {GOALS.map(g => (
                      <button key={g} onClick={() => toggleGoal(g)}
                        className={`btn btn-sm ${trainForm.goals.includes(g) ? "btn-success" : "btn-outline-secondary"}`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={generateTraining} disabled={generating}
                  className="btn btn-success w-100">
                  {generating ? "Генерируем..." : "⚡ Сгенерировать тренировку"}
                </button>
              </div>
            </div>

            {training && (
              <div className="d-flex flex-column gap-3">
                {[
                  {key: "warmup", label: "🔥 Разминка"},
                  {key: "main", label: "💪 Основная часть"},
                  {key: "game", label: "🏆 Игровая часть"},
                  {key: "cooldown", label: "🧘 Заминка"}
                ].map(sec => (
                  <div key={sec.key} className="card border-success">
                    <div className="card-header bg-success text-white d-flex justify-content-between">
                      <span>{sec.label}</span>
                      <span>{training[sec.key].duration} мин</span>
                    </div>
                    <div className="card-body">
                      {training[sec.key].exercises.map((ex, i) => (
                        <div key={i} className="mb-2 p-2 bg-light rounded">
                          <p className="fw-medium mb-1">{ex.name}</p>
                          <p className="small text-muted mb-1">{ex.duration} мин · {ex.category}</p>
                          {ex.description && <p className="small mb-0">{ex.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default App