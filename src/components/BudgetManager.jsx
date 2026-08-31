import { useState } from 'react'

const budgetCategories = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Bills',
  'Health',
  'Education',
]

function BudgetManager({ budgets, onAddBudget, onDeleteBudget }) {
  const [category, setCategory] = useState('')
  const [limit, setLimit] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (!category || !limit) {
      alert('Please select a category and enter a budget limit.')
      return
    }

    const newBudget = {
      id: Date.now(),
      category,
      limit: Number(limit),
    }

    onAddBudget(newBudget)

    setCategory('')
    setLimit('')
  }

  return (
    <div className="budget-container">
      <h2>Monthly Budgets</h2>

      <form onSubmit={handleSubmit} className="budget-form">
        <div className="form-group">
          <label>Category</label>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">Select category</option>

            {budgetCategories.map((categoryOption) => (
              <option key={categoryOption} value={categoryOption}>
                {categoryOption}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Monthly Limit</label>

          <input
  type="number"
  placeholder="Enter limit"
  min="0"
  step="1000"
  value={limit}
  onChange={(event) => setLimit(event.target.value)}
/>
        </div>

        <button type="submit" className="add-button">
          Add Budget
        </button>
      </form>

      <div className="budget-list">
        {budgets.length === 0 ? (
          <p className="no-transactions">
            No budgets added yet.
          </p>
        ) : (
          budgets.map((budget) => (
            <div className="budget-item" key={budget.id}>
              <div>
                <strong>{budget.category}</strong>
                <p>Monthly limit: ₹{budget.limit}</p>
              </div>

              <button
                className="delete-button"
                onClick={() => onDeleteBudget(budget.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default BudgetManager