import SummaryCard from '../components/SummaryCard'
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

function Dashboard({ transactions = [] }) {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce(
      (total, transaction) => total + Number(transaction.amount),
      0
    )

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce(
      (total, transaction) => total + Number(transaction.amount),
      0
    )

  const balance = totalIncome - totalExpenses

  const savingsRate =
    totalIncome > 0
      ? Math.round((balance / totalIncome) * 100)
      : 0

  const incomeExpenseData = [
    {
      name: 'Income',
      amount: totalIncome,
    },
    {
      name: 'Expenses',
      amount: totalExpenses,
    },
  ]

  const categoryTotals = {}

  transactions
    .filter((transaction) => transaction.type === 'expense')
    .forEach((transaction) => {
      const category = transaction.category

      if (!categoryTotals[category]) {
        categoryTotals[category] = 0
      }

      categoryTotals[category] += Number(transaction.amount)
    })

  const categoryData = Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value)

  const pieColors = [
    '#6366f1',
    '#ec4899',
    '#f59e0b',
    '#10b981',
    '#3b82f6',
    '#8b5cf6',
    '#ef4444',
    '#14b8a6',
    '#f97316',
    '#06b6d4',
  ]

  const barColors = {
    Income: '#10b981',
    Expenses: '#ef4444',
  }

  return (
    <>
      <div className="page-heading">
        <h1>Dashboard</h1>
        <p>Track your money and understand your spending.</p>
      </div>

      <section className="summary-grid">
        <SummaryCard
          title="Total Income"
          amount={`₹${totalIncome.toLocaleString('en-IN')}`}
        />

        <SummaryCard
          title="Total Expenses"
          amount={`₹${totalExpenses.toLocaleString('en-IN')}`}
        />

        <SummaryCard
          title="Balance"
          amount={`₹${balance.toLocaleString('en-IN')}`}
        />

        <SummaryCard
          title="Savings"
          amount={`₹${balance.toLocaleString('en-IN')}`}
        />

        <SummaryCard
          title="Savings Rate"
          amount={`${savingsRate}%`}
        />
      </section>

      <section className="dashboard-charts">
        <div className="dashboard-chart-card">
          <div className="dashboard-chart-header">
            <h2>Income vs Expenses</h2>
            <p>Compare your total income and expenses.</p>
          </div>

          <div className="dashboard-chart-wrapper">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={incomeExpenseData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString('en-IN')}`
                  }
                />

                <Legend />

                <Bar
                  dataKey="amount"
                  name="Amount"
                  radius={[8, 8, 0, 0]}
                >
                  {incomeExpenseData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={barColors[entry.name]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-chart-card">
          <div className="dashboard-chart-header">
            <h2>Expenses by Category</h2>
            <p>See where your money is being spent.</p>
          </div>

          {categoryData.length === 0 ? (
            <p className="empty-dashboard-chart">
              No expenses recorded yet.
            </p>
          ) : (
            <div className="dashboard-chart-wrapper">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(1)}%`
                    }
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          pieColors[index % pieColors.length]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value) =>
                      `₹${Number(value).toLocaleString('en-IN')}`
                    }
                  />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Dashboard