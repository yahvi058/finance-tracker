import { useMemo, useState } from 'react'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

function Charts({ transactions = [] }) {
  const currentDate = new Date()

  const [selectedMonth, setSelectedMonth] = useState(
    `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, '0')}`
  )

  const monthTransactions = useMemo(() => {
    return transactions.filter((transaction) =>
      transaction.date.startsWith(selectedMonth)
    )
  }, [transactions, selectedMonth])

  const income = monthTransactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + Number(transaction.amount), 0)

  const expenses = monthTransactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + Number(transaction.amount), 0)

  const incomeExpenseData = [
    {
      name: 'Income',
      amount: income,
    },
    {
      name: 'Expenses',
      amount: expenses,
    },
  ]

  const categoryData = useMemo(() => {
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
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value)
  }, [monthTransactions])

  return (
    <>
      <div className="page-heading">
        <h1>Charts</h1>
        <p>
          Visualize your income and spending patterns for a selected month.
        </p>
      </div>

      <div className="charts-month-selector">
        <label htmlFor="charts-month">Select Month</label>

        <input
          id="charts-month"
          type="month"
          value={selectedMonth}
          onChange={(event) => setSelectedMonth(event.target.value)}
        />
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h2>Income vs Expenses</h2>
          <p>Compare your total income and expenses.</p>
        </div>

        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={incomeExpenseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value) => `₹${Number(value).toFixed(2)}`}
              />
              <Legend />
              <Bar dataKey="amount" name="Amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h2>Expenses by Category</h2>
          <p>See how your expenses are distributed across categories.</p>
        </div>

        {categoryData.length === 0 ? (
          <p className="empty-chart-message">
            No expenses recorded for this month.
          </p>
        ) : (
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => `₹${Number(value).toFixed(2)}`}
                />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </>
  )
}

export default Charts