import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import SummaryCard from './components/SummaryCard'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'

function App() {
  const [transactions, setTransactions] = useState([])
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

      </main>
    </div>
  )
}

export default App