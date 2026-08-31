import { useEffect, useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import SummaryCard from './components/SummaryCard'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import BudgetManager from './components/BudgetManager'
import { supabase } from './lib/supabase'

function App() {
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])

  async function loadTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error('Error loading transactions:', error)
    return
  }

  setTransactions(data)
}

  useEffect(() => {
  loadTransactions()
  loadBudgets()
}, [])

async function loadBudgets() {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error loading budgets:', error)
    return
  }

  setBudgets(
    data.map((budget) => ({
      ...budget,
      limit: budget.amount,
    }))
  )
}

  async function addTransaction(transaction) {
  const { data, error } = await supabase
    .from('transactions')
    .insert([
      {
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        date: transaction.date,
      },
    ])
    .select()

  if (error) {
    console.error('Error adding transaction:', error)
    alert('Could not add transaction.')
    return
  }

  setTransactions((currentTransactions) => [
    ...currentTransactions,
    data[0],
  ])
}

async function deleteTransaction(transactionId) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', transactionId)

  if (error) {
    console.error('Error deleting transaction:', error)
    alert('Could not delete transaction.')
    return
  }

  setTransactions((currentTransactions) =>
    currentTransactions.filter(
      (transaction) => transaction.id !== transactionId
    )
  )
}

async function addBudget(budget) {
  const { data, error } = await supabase
    .from('budgets')
    .insert([
      {
        category: budget.category,
        amount: budget.limit,
      },
    ])
    .select()

  if (error) {
    console.error('Error adding budget:', error)
    alert('Could not add budget.')
    return
  }

  setBudgets((currentBudgets) => [
    ...currentBudgets,
    {
      ...data[0],
      limit: data[0].amount,
    },
  ])
}

async function deleteBudget(budgetId) {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', budgetId)

  if (error) {
    console.error('Error deleting budget:', error)
    alert('Could not delete budget.')
    return
  }

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