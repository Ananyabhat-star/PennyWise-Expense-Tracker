import { useEffect, useState } from 'react'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import './App.css'

function App() {

const [expenses, setExpenses] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
const [editingId, setEditingId] = useState(null)
const [searchTerm, setSearchTerm] = useState('')
const [selectedCategory, setSelectedCategory] = useState('All')

useEffect(() => {
  fetch('http://localhost:8080/api/expenses')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to load expenses')
      }
      return response.json()
    })
    .then((data) => {
      setExpenses(data)
      setError('')
    })
    .catch(() => {
      setError('Could not connect to the backend. Check that Spring Boot is running.')
    })
    .finally(() => {
      setLoading(false)
    })
}, [])
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [description, setDescription] = useState('')
  
const filteredExpenses = expenses.filter((expense) => {
  const matchesSearch = expense.title
    .toLowerCase()
    .includes(searchTerm.toLowerCase())

  const matchesCategory =
    selectedCategory === 'All' ||
    expense.category === selectedCategory

  return matchesSearch && matchesCategory
})


const currentMonth = new Date().toISOString().slice(0, 7)

const currentMonthExpenses = expenses.filter(
  (expense) => expense.expenseDate?.slice(0, 7) === currentMonth
)

const monthlyTotal = currentMonthExpenses.reduce(
  (sum, expense) => sum + Number(expense.amount),
  0
)

const monthlyCategories = new Set(
  currentMonthExpenses.map((expense) => expense.category)
).size

  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  )

const categoryData = Object.values(
  expenses.reduce((totals, expense) => {
    const category = expense.category || 'Other'

    if (!totals[category]) {
      totals[category] = { name: category, amount: 0 }
    }

    totals[category].amount += Number(expense.amount)

    return totals
  }, {})
)

const chartColors = [
  '#8062F5',
  '#32B890',
  '#F4A340',
  '#E56B8A',
  '#4C9BE8',
  '#9B75D7',
  '#E0BD45',
  '#7A8999',
]

 
const monthlyData = Object.values(
  expenses.reduce((months, expense) => {
    const date = expense.expenseDate
    const month = date ? date.slice(0, 7) : 'Unknown'

    if (month !== 'Unknown') {
      if (!months[month]) {
        months[month] = { month, amount: 0 }
      }

      months[month].amount += Number(expense.amount)
    }

    return months
  }, {})
).sort((a, b) => a.month.localeCompare(b.month))
 

async function handleSubmit(event) {
  event.preventDefault()

  if (!title.trim() || !amount || Number(amount) <= 0) {
    return
  }

  const expenseData = {
    title: title.trim(),
    amount: Number(amount),
    category,
    expenseDate,
    description,
  }

  try {
    const url = editingId
      ? `http://localhost:8080/api/expenses/${editingId}`
      : 'http://localhost:8080/api/expenses'

    const response = await fetch(url, {
      method: editingId ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData),
    })

    if (!response.ok) {
      throw new Error('Failed to save expense')
    }

    let savedExpense = null

    if (editingId) {
      savedExpense = await response.json()
      setExpenses((currentExpenses) =>
        currentExpenses.map((expense) =>
          expense.id === editingId ? savedExpense : expense
        )
      )
    } else {
      savedExpense = await response.json()
      setExpenses((currentExpenses) => [...currentExpenses, savedExpense])
    }

    setEditingId(null)
    setTitle('')
    setAmount('')
    setCategory('Food')
    setExpenseDate(new Date().toISOString().split('T')[0])
    setDescription('')
    setError('')
  } catch {
    setError('Could not save expense. Check the backend and try again.')
  }
}

  
async function handleDelete(id) {
  try {
    const response = await fetch(`http://localhost:8080/api/expenses/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete expense')
    }

    setExpenses((currentExpenses) =>
      currentExpenses.filter((expense) => expense.id !== id)
    )
    setError('')
  } catch {
    setError('Could not delete expense. Please try again.')
  }
}

function handleEdit(expense) {
  setEditingId(expense.id)
  setTitle(expense.title)
  setAmount(String(expense.amount))
  setCategory(expense.category)
  setExpenseDate(expense.expenseDate)
  setDescription(expense.description || '')
}


  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="brand">PennyWise<span>.</span></h2>
        <p className="sidebar-label">MENU</p>
        <div className="nav-item active">▦ &nbsp; Dashboard</div>
        <div className="nav-item">↔ &nbsp; Transactions</div>
        <div className="nav-item">◷ &nbsp; Reports</div>
        <div className="nav-item">⚙ &nbsp; Settings</div>
        <div className="sidebar-bottom">
          <div className="avatar">A</div>
          <div>
            <strong>My Account</strong>
            <p>Personal workspace</p>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">YOUR FINANCES, SIMPLIFIED</p>
            <h1>Dashboard</h1>
          </div>
          <div className="date-chip">
            <span>◷</span> {new Date().toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </div>
        </header>

        <section className="welcome">
          <div>
            <p className="welcome-tag">YOUR MONEY AT A GLANCE</p>
            <h2>Take control of your money.</h2>
            <p>Every rupee counts. Keep track of where yours goes.</p>
          </div>
          <div className="welcome-icon">₹</div>
        </section>

        <section className="summary-grid">
          <article className="summary-card">
            <div className="card-heading">
              <span>Total Expenses</span>
              <span className="card-icon purple">↗</span>
            </div>
            <h2>₹{total.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}</h2>
            <p className="muted">All expenses added this session</p>
          </article>
          <article className="summary-card">
            <div className="card-heading">
              <span>Transactions</span>
              <span className="card-icon green">↔</span>
            </div>
            <h2>{expenses.length}</h2>
            <p className="muted">Expenses recorded</p>
          </article>
          <article className="summary-card">
            <div className="card-heading">
              <span>Top Category</span>
              <span className="card-icon orange">◈</span>
            </div>
            <h2 className="category-total">
              {expenses.length
                ? expenses.reduce((counts, expense) => {
                    counts[expense.category] = (counts[expense.category] || 0) + Number(expense.amount)
                    return counts
                  }, {})
                  ? Object.entries(expenses.reduce((counts, expense) => {
                      counts[expense.category] = (counts[expense.category] || 0) + Number(expense.amount)
                      return counts
                    }, {})).sort((a, b) => b[1] - a[1])[0][0]
                  : '—'
                : '—'}
            </h2>
            <p className="muted">By amount spent</p>
          </article>
        </section>

     
<section className="summary-grid">
  <article className="summary-card">
    <div className="card-heading">
      <span>Spent This Month</span>
      <span className="card-icon purple">₹</span>
    </div>
    <h2>
      ₹{monthlyTotal.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </h2>
    <p className="muted">Total expenses for this month</p>
  </article>

  <article className="summary-card">
    <div className="card-heading">
      <span>Categories Used</span>
      <span className="card-icon green">◈</span>
    </div>
    <h2>{monthlyCategories}</h2>
    <p className="muted">Different spending categories this month</p>
  </article>
</section>
   
<section className="reports-grid">
  <article className="panel report-panel">
    <div className="panel-heading">
      <div>
        <h2>Spending by Category</h2>
        <p>Breakdown of your expenses</p>
      </div>
      <span className="panel-icon">◔</span>
    </div>

    {categoryData.length === 0 ? (
      <div className="empty-state">
        <p>No expense data available yet.</p>
      </div>
    ) : (
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={55}
            paddingAngle={3}
          >
            {categoryData.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={chartColors[index % chartColors.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [
              `₹${Number(value).toLocaleString('en-IN')}`,
              'Spent',
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    )}
  </article>
</section>

<section className="reports-grid">
  <article className="panel report-panel">
    <div className="panel-heading">
      <div>
        <h2>Monthly Spending</h2>
        <p>Compare your spending by month</p>
      </div>
      <span className="panel-icon">▥</span>
    </div>

    {monthlyData.length === 0 ? (
      <div className="empty-state">
        <p>No monthly data available yet.</p>
      </div>
    ) : (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value) => [
              `₹${Number(value).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
              'Total Spending',
            ]}
          />
          <Bar
            dataKey="amount"
            name="Total Spending"
            fill="#8062F5"
            radius={[7, 7, 0, 0]}
            maxBarSize={80}
          />
        </BarChart>
      </ResponsiveContainer>
    )}
  </article>
</section>

        <section className="content-grid">
          <article className="panel">
            <div className="panel-heading">
              <div>
                <h2>{editingId ? 'Edit expense' : 'Add an expense'}</h2>
                <p>{editingId ? 'Update your expense details' : 'Record a purchase or payment'}</p>
              </div>
              <span className="panel-icon">＋</span>
            </div>
            {error && <p role="alert">{error}</p>}          
            <form onSubmit={handleSubmit}>
              <label htmlFor="title">Expense name</label>
              <input
                id="title"
                placeholder="e.g. Grocery shopping"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />

              <div className="form-row">
                <div>
                  <label htmlFor="amount">Amount (₹)</label>
                  <input
                    id="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                  >
                    <option>Food</option>
                    <option>Travel</option>
                    <option>Shopping</option>
                    <option>Bills</option>
                    <option>Health</option>
                    <option>Education</option>
                    <option>Entertainment</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <label htmlFor="expenseDate">Expense date</label>
              <input
                id="expenseDate"
                type="date"
                value={expenseDate}
                onChange={(event) => setExpenseDate(event.target.value)}
                required
              />

              <label htmlFor="description">Description (optional)</label>
              <textarea
                id="description"
                placeholder="Add a note..."
                rows="3"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />

              <button className="submit-button" type="submit">
                {editingId ? 'Save Changes' : '+ Add Expense'}
              </button>
            </form>
          </article>

          <article className="panel transactions-panel">
            <div className="panel-heading">
              <div>
                <h2>Recent transactions</h2>
                <p>Your latest recorded expenses</p>
              </div>
              <span className="transaction-count">{expenses.length}</span>
            </div>
            
            <div className="expense-filters">
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />

              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>


            {expenses.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">₹</div>
                <h3>No expenses yet</h3>
                <p>Your transactions will appear here when you add your first expense.</p>
              </div>
            ) : (
              <div className="expense-list">
                {[...filteredExpenses].reverse().map((expense, index) => (
                  <div className="expense-item" key={`${expense.title}-${index}`}>
                    <div className="expense-symbol">
                      {expense.category === 'Food' ? '♧' :
                        expense.category === 'Travel' ? '↗' :
                        expense.category === 'Shopping' ? '◇' : '₹'}
                    </div>
                    <div className="expense-details">
                      <strong>{expense.title}</strong>
                      <p>{expense.category} · {expense.expenseDate}</p>
                    </div>
                    
                    <div className="expense-actions">
                      <strong className="expense-amount">
                        −₹{Number(expense.amount).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </strong>
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => handleEdit(expense)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => handleDelete(expense.id)}
                        aria-label={`Delete ${expense.title}`}
                      >
                        Delete
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </article>
        </section>

        <footer>Made for mindful spending. <span>Spend smarter, live better.</span></footer>
      </main>
    </div>
  )
}

export default App
