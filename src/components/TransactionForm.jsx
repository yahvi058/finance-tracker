import { useState } from 'react'

function TransactionForm({ onAddTransaction }) {
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (!amount || !category || !date) {
      alert('Please fill in amount, category, and date.')
      return
    }

    const newTransaction = {
      id: Date.now(),
      type,
      amount: Number(amount),
      category,
      description,
      date,
    }

    onAddTransaction(newTransaction)

    setAmount('')
    setCategory('')
    setDescription('')
    setDate('')
  }

  return (
    <div className="transaction-form-container">
      <h2>Add Transaction</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Type</label>

          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="form-group">
          <label>Amount</label>

          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Category</label>

          <input
            type="text"
            placeholder="e.g. Food, Salary"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description</label>

          <input
            type="text"
            placeholder="Enter description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Date</label>

          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>

        <button type="submit" className="add-button">
          Add Transaction
        </button>
      </form>
    </div>
  )
}

export default TransactionForm