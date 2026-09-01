import { useMemo, useState } from 'react'

function MonthlySummary({ transactions = [] }) {
  const currentDate = new Date()

  const [selectedMonth, setSelectedMonth] = useState(
    `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, '0')}`
  )

  const monthTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      return transaction.date.startsWith(selectedMonth)
    })
  }, [transactions, selectedMonth])

  const totalIncome = useMemo(() => {
    return monthTransactions
      .filter((transaction) => transaction.type === 'income')
      .reduce(
        (total, transaction) => total + Number(transaction.amount),
        0
      )
  }, [monthTransactions])

  const totalExpenses = useMemo(() => {
    return monthTransactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce(
        (total, transaction) => total + Number(transaction.amount),
        0
      )
  }, [monthTransactions])

  const netBalance = totalIncome - totalExpenses

  const categoryExpenses = useMemo(() => {
    const categoryTotals = {}

    monthTransactions
      .filter((transaction) => transaction.type === 'expense')
      .forEach((transaction) => {
        const category = transaction.category

        if (!categoryTotals[category]) {
          categoryTotals[category] = 0
        }

        categoryTotals[category] += Number(transaction.amount)
      })

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount)
  }, [monthTransactions])

  const getPercentage = (amount) => {
    if (totalExpenses === 0) return 0

    return (amount / totalExpenses) * 100
  }

  return (
    <>
      <div className="page-heading">
        <h1>Monthly Summary</h1>
        <p>
          Review your income, expenses, and spending patterns for a
          selected month.
        </p>
      </div>

      <div className="summary-month-selector">
        <label htmlFor="summary-month">Select Month</label>

        <input
          id="summary-month"
          type="month"
          value={selectedMonth}
          onChange={(event) => setSelectedMonth(event.target.value)}
        />
      </div>

      <div className="monthly-summary-cards">
        <div className="monthly-summary-card">
          <span>Total Income</span>
          <strong className="summary-income">
            ₹{totalIncome.toFixed(2)}
          </strong>
        </div>

        <div className="monthly-summary-card">
          <span>Total Expenses</span>
          <strong className="summary-expense">
            ₹{totalExpenses.toFixed(2)}
          </strong>
        </div>

        <div className="monthly-summary-card">
          <span>Net Balance</span>
          <strong
            className={
              netBalance >= 0
                ? 'summary-positive'
                : 'summary-negative'
            }
          >
            ₹{netBalance.toFixed(2)}
          </strong>
        </div>
      </div>

      <div className="summary-category-container">
        <div className="summary-section-header">
          <h2>Expense Breakdown</h2>
          <p>Where your money was spent this month.</p>
        </div>

        {categoryExpenses.length === 0 ? (
          <p className="empty-summary-message">
            No expenses recorded for this month.
          </p>
        ) : (
          <div className="summary-category-list">
            {categoryExpenses.map((item) => (
              <div
                className="summary-category-item"
                key={item.category}
              >
                <div className="summary-category-header">
                  <strong>{item.category}</strong>

                  <span>
                    ₹{item.amount.toFixed(2)}
                  </span>
                </div>

                <div className="summary-progress-track">
                  <div
                    className="summary-progress-bar"
                    style={{
                      width: `${getPercentage(item.amount)}%`,
                    }}
                  />
                </div>

                <span className="summary-category-percentage">
                  {getPercentage(item.amount).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default MonthlySummary