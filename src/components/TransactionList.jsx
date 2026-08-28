function TransactionList({ transactions, onDeleteTransaction }) {
  return (
    <div className="transaction-list-container">
      <h2>Transaction History</h2>

      {transactions.length === 0 ? (
        <p className="no-transactions">
          No transactions added yet.
        </p>
      ) : (
        <div className="transaction-list">
          {transactions.map((transaction) => (
            <div className="transaction-item" key={transaction.id}>
              <div className="transaction-info">
                <strong>{transaction.description || 'No description'}</strong>
                <span>
                  {transaction.category} • {transaction.date}
                </span>
              </div>

              <div className="transaction-right">
                <span
                  className={
                    transaction.type === 'income'
                      ? 'income-amount'
                      : 'expense-amount'
                  }
                >
                  {transaction.type === 'income' ? '+' : '-'}₹
                  {transaction.amount}
                </span>

                <button
                  className="delete-button"
                  onClick={() => onDeleteTransaction(transaction.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TransactionList