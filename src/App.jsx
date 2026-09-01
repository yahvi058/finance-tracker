import { useEffect, useState } from 'react'
import './App.css'

import Sidebar from './components/Sidebar'
import TransactionForm from './components/TransactionForm'
import { supabase } from './lib/supabase'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import Categories from './pages/Categories'
import MonthlySummary from './pages/MonthlySummary'
import Charts from './pages/Charts'

function App() {
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [categories, setCategories] = useState([])

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

  async function loadCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error loading categories:', error)
      return
    }

    setCategories(data)
  }

  useEffect(() => {
    loadTransactions()
    loadBudgets()
    loadCategories()
  }, [])

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
          amount: Number(budget.amount),
        },
      ])
      .select()

    if (error) {
      console.error('Error adding budget:', error)
      alert('Could not add budget.')
      return
    }

    setBudgets((currentBudgets) => [...currentBudgets, data[0]])
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

  async function addCategory(category) {
    const { data, error } = await supabase
      .from('categories')
      .insert([
        {
          name: category.name,
          type: category.type,
        },
      ])
      .select()

    if (error) {
      console.error('Error adding category:', error)

      if (error.code === '23505') {
        alert('This category already exists.')
      } else {
        alert('Could not add category.')
      }

      return false
    }

    setCategories((currentCategories) =>
      [...currentCategories, data[0]].sort((a, b) =>
        a.name.localeCompare(b.name)
      )
    )

    return true
  }

  async function updateCategory(categoryId, updatedCategory) {
    const oldCategory = categories.find(
      (category) => category.id === categoryId
    )

    if (!oldCategory) {
      return false
    }

    const { data, error } = await supabase
      .from('categories')
      .update({
        name: updatedCategory.name,
        type: updatedCategory.type,
      })
      .eq('id', categoryId)
      .select()

    if (error) {
      console.error('Error updating category:', error)

      if (error.code === '23505') {
        alert('This category already exists.')
      } else {
        alert('Could not update category.')
      }

      return false
    }

    if (
      oldCategory.name !== updatedCategory.name ||
      oldCategory.type !== updatedCategory.type
    ) {
      const { error: transactionError } = await supabase
        .from('transactions')
        .update({
          category: updatedCategory.name,
        })
        .eq('category', oldCategory.name)
        .eq('type', oldCategory.type)

      if (transactionError) {
        console.error(
          'Error updating related transactions:',
          transactionError
        )
      }

      setTransactions((currentTransactions) =>
        currentTransactions.map((transaction) =>
          transaction.category === oldCategory.name &&
          transaction.type === oldCategory.type
            ? {
                ...transaction,
                category: updatedCategory.name,
              }
            : transaction
        )
      )
    }

    setCategories((currentCategories) =>
      currentCategories
        .map((category) =>
          category.id === categoryId ? data[0] : category
        )
        .sort((a, b) => a.name.localeCompare(b.name))
    )

    return true
  }

  async function deleteCategory(category) {
    const { data: relatedTransactions, error: transactionError } =
      await supabase
        .from('transactions')
        .select('id')
        .eq('category', category.name)
        .eq('type', category.type)
        .limit(1)

    if (transactionError) {
      console.error(
        'Error checking category usage:',
        transactionError
      )
      alert('Could not check whether this category is being used.')
      return false
    }

    if (relatedTransactions.length > 0) {
      alert(
        'This category is being used by existing transactions and cannot be deleted.'
      )
      return false
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', category.id)

    if (error) {
      console.error('Error deleting category:', error)
      alert('Could not delete category.')
      return false
    }

    setCategories((currentCategories) =>
      currentCategories.filter(
        (currentCategory) => currentCategory.id !== category.id
      )
    )

    return true
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
                  categories={categories}
                  onAddTransaction={addTransaction}
                  onDeleteTransaction={deleteTransaction}
                  onAddBudget={addBudget}
                  onDeleteBudget={deleteBudget}
                />
              }
            />

            <Route
              path="/transactions"
              element={
                <Transactions
                  transactions={transactions}
                  categories={categories}
                  onAddTransaction={addTransaction}
                  onDeleteTransaction={deleteTransaction}
                />
              }
            />

            <Route
              path="/budgets"
              element={
                <Budgets
                  budgets={budgets}
                  transactions={transactions}
                  categories={categories}
                  onAddBudget={addBudget}
                  onDeleteBudget={deleteBudget}
                />
              }
            />

            <Route
              path="/categories"
              element={
                <Categories
                  categories={categories}
                  onAddCategory={addCategory}
                  onUpdateCategory={updateCategory}
                  onDeleteCategory={deleteCategory}
                />

                
              }
            />

            <Route
  path="/monthly-summary"
  element={<MonthlySummary transactions={transactions} />}
/>

<Route
  path="/charts"
  element={<Charts transactions={transactions} />}
/>

          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App