import { useMemo, useState } from 'react'

function Budgets({
  budgets = [],
  transactions = [],
  categories = [],
  onAddBudget,
  onDeleteBudget,
}) {
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')

  const expenseCategories = categories.filter(
    (categoryItem) => categoryItem.type === 'expense'
  )

  const getCurrentMonthExpenses = (categoryName) => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()

    return transactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.date)

        return (
          transaction.type === 'expense' &&
          transaction.category === categoryName &&
          transactionDate.getFullYear() === currentYear &&
          transactionDate.getMonth() === currentMonth
        )
      })
      .reduce(
        (total, transaction) => total + Number(transaction.amount),
        0
      )
  }

  const totalBudget = useMemo(() => {
    return budgets.reduce(
      (total, budget) => total + Number(budget.amount),
      0
    )
  }, [budgets])

  const totalSpent = useMemo(() => {
    return budgets.reduce(
      (total, budget) =>
        total + getCurrentMonthExpenses(budget.category),
      0
    )
  }, [budgets, transactions])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!category || !amount) {
      alert('Please select a category and enter a budget amount.')
      return
    }

    const existingBudget = budgets.find(
      (budget) => budget.category === category
    )

    if (existingBudget) {
      alert('A budget already exists for this category.')
      return
    }

    await onAddBudget({
      category,
      amount: Number(amount),
    })

    setCategory('')
    setAmount('')
  }

  const handleDelete = async (budgetId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this budget?'
    )

    if (!confirmed) return

    await onDeleteBudget(budgetId)
  }

  const getProgressPercentage = (spent, budgetAmount) => {
    if (budgetAmount <= 0) return 0

    return Math.min((spent / budgetAmount) * 100, 100)
  }

  const getProgressStatus = (spent, budgetAmount) => {
    if (spent > budgetAmount) {
      return 'over-budget'
    }

    if (spent >= budgetAmount * 0.8) {
      return 'near-limit'
    }

    return 'within-budget'
  }

  return (
    <>
      <div className="page-heading">
        <h1>Budgets</h1>
        <p>
          Set monthly spending limits and keep your expenses under control.
        </p>
      </div>

      <div className="budget-summary">
        <div className="budget-summary-card">
          <span>Total Budget</span>
          <strong>₹{totalBudget.toFixed(2)}</strong>
        </div>

        <div className="budget-summary-card">
          <span>Spent This Month</span>
          <strong>₹{totalSpent.toFixed(2)}</strong>
        </div>

        <div className="budget-summary-card">
          <span>Remaining</span>
          <strong>
            ₹{Math.max(totalBudget - totalSpent, 0).toFixed(2)}
          </strong>
        </div>
      </div>

      <div className="transaction-form-container">
        <h2>Add Monthly Budget</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="budget-category">Category</label>

            <select
              id="budget-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">Select category</option>

              {expenseCategories.map((categoryItem) => (
                <option key={categoryItem.id} value={categoryItem.name}>
                  {categoryItem.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="budget-amount">Monthly Limit</label>

            <input
              id="budget-amount"
              type="number"
              placeholder="Enter limit"
              min="0"
              step="1000"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>

          <button type="submit" className="add-button">
            Add Budget
          </button>
        </form>
      </div>

      <div className="budget-list-container">
        <div className="budget-list-header">
          <h2>Your Budgets</h2>
          <p>Budget progress for the current month.</p>
        </div>

        {budgets.length === 0 ? (
          <p className="empty-budget-message">
            No budgets added yet.
          </p>
        ) : (
          <div className="budget-list">
            {budgets.map((budget) => {
              const spent = getCurrentMonthExpenses(budget.category)
              const budgetAmount = Number(budget.amount)
              const remaining = budgetAmount - spent
              const progress = getProgressPercentage(
                spent,
                budgetAmount
              )
              const status = getProgressStatus(
                spent,
                budgetAmount
              )

              return (
                <div className="budget-item" key={budget.id}>
                  <div className="budget-item-header">
                    <div>
                      <h3>{budget.category}</h3>
                      <p>
                        ₹{spent.toFixed(2)} spent of ₹
                        {budgetAmount.toFixed(2)}
                      </p>
                    </div>

                    <button
                      className="budget-delete-button"
                      onClick={() => handleDelete(budget.id)}
                    >
                      Delete
                    </button>
                  </div>

                  <div className="budget-progress-track">
                    <div
                      className={`budget-progress-bar ${status}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="budget-item-footer">
                    {remaining >= 0 ? (
                      <span>
                        ₹{remaining.toFixed(2)} remaining
                      </span>
                    ) : (
                      <span className="budget-over-text">
                        ₹{Math.abs(remaining).toFixed(2)} over budget
                      </span>
                    )}

                    <span>
                      {Math.round(
                        (spent / budgetAmount) * 100
                      )}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default Budgets