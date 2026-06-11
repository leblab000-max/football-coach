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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚽</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Football Coach</h1>
              <p className="text-sm text-gray-500">Помощник детского тренера</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setPage("exercises")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${page === "exercises" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
              📋 Упражнения
            </button>
            <button onClick={() => setPage("training")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${page === "training" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
              ⚡ Тренировка
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">

        {page === "exercises" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                База упражнений
                <span className="ml-2 bg-blue-100 text-blue-700 text-sm px-2 py-0.5 rounded-full">{exercises.length}</span>
              </h2>
              <button onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                {showForm ? "✕ Отмена" : "+ Добавить"}
              </button>
            </div>

            {showForm && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Новое упражнение</h2>
                <div className="space-y-3">
                  <input placeholder="Название" value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  <select value={form.category}
                    onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <textarea placeholder="Описание" value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-20" />
                  <input placeholder="Инвентарь" value={form.equipment}
                    onChange={e => setForm({...form, equipment: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Возраст от</label>
                      <input type="number" value={form.age_min}
                        onChange={e => setForm({...form, age_min: +e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Возраст до</label>
                      <input type="number" value={form.age_max}
                        onChange={e => setForm({...form, age_max: +e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Минут</label>
                      <input type="number" value={form.duration_minutes}
                        onChange={e => setForm({...form, duration_minutes: +e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                    </div>
                  </div>
                  <button onClick={handleSubmit}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium">
                    Сохранить
                  </button>
                </div>
              </div>
            )}

            {exercises.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <div className="text-5xl mb-4">📋</div>
                <p>Упражнений пока нет</p>
              </div>
            )}

            <div className="space-y-3">
              {exercises.map(ex => (
                <div key={ex.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{ex.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">📂 {ex.category}</span>
                        <span className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-full">⏱ {ex.duration_minutes} мин</span>
                        <span className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-full">👥 {ex.min_players}-{ex.max_players}</span>
                        <span className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-full">🎂 {ex.age_min}-{ex.age_max} лет</span>
                        {ex.equipment && <span className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-full">🎒 {ex.equipment}</span>}
                      </div>
                      {ex.description && <p className="text-sm text-gray-600 mt-3">{ex.description}</p>}
                    </div>
                    <button onClick={() => handleDelete(ex.id)}
                      className="text-gray-300 hover:text-red-500 ml-4 text-lg">🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {page === "training" && (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">⚡ Генератор тренировки</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Возраст</label>
                  <input type="number" value={trainForm.age}
                    onChange={e => setTrainForm({...trainForm, age: +e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Игроков</label>
                  <input type="number" value={trainForm.players}
                    onChange={e => setTrainForm({...trainForm, players: +e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Минут</label>
                  <input type="number" value={trainForm.duration}
                    onChange={e => setTrainForm({...trainForm, duration: +e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="mb-4">
                <label className="text-xs text-gray-500 mb-2 block">Цели тренировки</label>
                <div className="flex flex-wrap gap-2">
                  {GOALS.map(g => (
                    <button key={g} onClick={() => toggleGoal(g)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${trainForm.goals.includes(g) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300"}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={generateTraining} disabled={generating}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 rounded-lg font-medium">
                {generating ? "Генерируем..." : "⚡ Сгенерировать тренировку"}
              </button>
            </div>

            {training && (
              <div className="space-y-4">
                {[
                  {key: "warmup", label: "🔥 Разминка", color: "orange"},
                  {key: "main", label: "💪 Основная часть", color: "blue"},
                  {key: "game", label: "🏆 Игровая часть", color: "green"},
                  {key: "cooldown", label: "🧘 Заминка", color: "gray"}
                ].map(sec => (
                  <div key={sec.key} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{sec.label}</h3>
                      <span className="text-sm text-gray-500">{training[sec.key].duration} мин</span>
                    </div>
                    <div className="space-y-2">
                      {training[sec.key].exercises.map((ex, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-3">
                          <p className="font-medium text-sm">{ex.name}</p>
                          <p className="text-xs text-gray-500 mt-1">⏱ {ex.duration} мин · 📂 {ex.category}</p>
                          {ex.description && <p className="text-xs text-gray-600 mt-1">{ex.description}</p>}
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