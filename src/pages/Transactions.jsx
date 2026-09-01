import { useState } from 'react'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'

function Transactions({
  transactions,
  categories,
  onAddTransaction,
  onDeleteTransaction,
}) {
  const [filter, setFilter] = useState('all')

  const filteredTransactions = transactions
    .filter((transaction) => {
      if (filter === 'all') return true
      return transaction.type === filter
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <>
      <div className="page-heading">
        <h1>Transactions</h1>
        <p>View and manage all your income and expenses.</p>
      </div>

      <TransactionForm
        categories={categories}
        onAddTransaction={onAddTransaction}
      />

      <div className="transaction-history-header">
        <p>
          Showing {filteredTransactions.length} transaction
          {filteredTransactions.length !== 1 ? 's' : ''}
        </p>

        <div className="transaction-filters">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>

          <button
            className={filter === 'income' ? 'active' : ''}
            onClick={() => setFilter('income')}
          >
            Income
          </button>

          <button
            className={filter === 'expense' ? 'active' : ''}
            onClick={() => setFilter('expense')}
          >
            Expenses
          </button>
        </div>
      </div>

      <TransactionList
        transactions={filteredTransactions}
        onDeleteTransaction={onDeleteTransaction}
      />
    </>
  )
}

export default Transactions