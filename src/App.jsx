import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import SummaryCard from './components/SummaryCard'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import BudgetManager from './components/BudgetManager'

function App() {
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  function addTransaction(transaction) {
  setTransactions((currentTransactions) => [
    ...currentTransactions,
    transaction,
  ])
}

function deleteTransaction(transactionId) {
  setTransactions((currentTransactions) =>
    currentTransactions.filter(
      (transaction) => transaction.id !== transactionId
    )
  )
}

function addBudget(budget) {
  setBudgets((currentBudgets) => [
    ...currentBudgets,
    budget,
  ])
}

function deleteBudget(budgetId) {
  setBudgets((currentBudgets) =>
    currentBudgets.filter(
      (budget) => budget.id !== budgetId
    )
  )
}

  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <Header />

        <section className="summary-grid">
          <SummaryCard
            title="Total Income"
            amount="₹50,000"
          />

          <SummaryCard
            title="Total Expenses"
            amount="₹32,000"
          />

          <SummaryCard
            title="Balance"
            amount="₹18,000"
          />

          <SummaryCard
            title="Savings"
            amount="₹18,000"
          />

          <SummaryCard
            title="Savings Rate"
            amount="36%"
          />
        </section>
        
        <TransactionForm onAddTransaction={addTransaction} />

        <TransactionList
  transactions={transactions}
  onDeleteTransaction={deleteTransaction}
/>

<BudgetManager
  budgets={budgets}
  onAddBudget={addBudget}
  onDeleteBudget={deleteBudget}
/>

      </main>
    </div>
  )
}

export default App