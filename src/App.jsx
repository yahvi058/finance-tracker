import { useEffect, useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import SummaryCard from './components/SummaryCard'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import BudgetManager from './components/BudgetManager'
import { supabase } from './lib/supabase'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import Categories from './pages/Categories'

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
  <BrowserRouter>
    <div className="app">
      <Sidebar />

      <main className="main-content">

       <Routes>
  <Route
  path="/"
  element={
    <Dashboard
      transactions={transactions}
      budgets={budgets}
      onAddTransaction={addTransaction}
      onDeleteTransaction={deleteTransaction}
      onAddBudget={addBudget}
      onDeleteBudget={deleteBudget}
    />
  }
/>

  <Route
    path="/transactions"
    element={<Transactions />}
  />

  <Route
    path="/budgets"
    element={<Budgets />}
  />

  <Route
    path="/categories"
    element={<Categories />}
  />
</Routes>

      </main>
        </div>
  </BrowserRouter>
  )
}

export default App