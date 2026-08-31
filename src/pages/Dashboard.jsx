import SummaryCard from '../components/SummaryCard'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'
import BudgetManager from '../components/BudgetManager'

function Dashboard({
  transactions,
  budgets,
  onAddTransaction,
  onDeleteTransaction,
  onAddBudget,
  onDeleteBudget,
}) {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + Number(transaction.amount), 0)

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + Number(transaction.amount), 0)

  const balance = totalIncome - totalExpenses

  const savingsRate =
    totalIncome > 0
      ? Math.round((balance / totalIncome) * 100)
      : 0

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

      <TransactionForm onAddTransaction={onAddTransaction} />

      <TransactionList
        transactions={transactions}
        onDeleteTransaction={onDeleteTransaction}
      />

      <BudgetManager
        budgets={budgets}
        onAddBudget={onAddBudget}
        onDeleteBudget={onDeleteBudget}
      />
    </>
  )
}

export default Dashboard