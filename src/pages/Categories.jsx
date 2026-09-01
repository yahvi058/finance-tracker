import { useState } from 'react'

function Categories({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) {
  const [name, setName] = useState('')
  const [type, setType] = useState('expense')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editType, setEditType] = useState('expense')

  const expenseCategories = categories.filter(
    (category) => category.type === 'expense'
  )

  const incomeCategories = categories.filter(
    (category) => category.type === 'income'
  )

  async function handleAddCategory(event) {
    event.preventDefault()

    const trimmedName = name.trim()

    if (!trimmedName) {
      alert('Please enter a category name.')
      return
    }

    const success = await onAddCategory({
      name: trimmedName,
      type,
    })

    if (success) {
      setName('')
      setType('expense')
    }
  }

  function startEditing(category) {
    setEditingId(category.id)
    setEditName(category.name)
    setEditType(category.type)
  }

  function cancelEditing() {
    setEditingId(null)
    setEditName('')
    setEditType('expense')
  }

  async function handleUpdateCategory(event, categoryId) {
    event.preventDefault()

    const trimmedName = editName.trim()

    if (!trimmedName) {
      alert('Please enter a category name.')
      return
    }

    const success = await onUpdateCategory(categoryId, {
      name: trimmedName,
      type: editType,
    })

    if (success) {
      cancelEditing()
    }
  }

  async function handleDeleteCategory(category) {
    const confirmed = window.confirm(
      `Delete the "${category.name}" category?`
    )

    if (!confirmed) {
      return
    }

    await onDeleteCategory(category)
  }

  function renderCategoryList(categoryList) {
    return (
      <div className="category-list">
        {categoryList.length === 0 ? (
          <p className="empty-category-message">
            No categories available.
          </p>
        ) : (
          categoryList.map((category) => {
            if (editingId === category.id) {
              return (
                <form
                  className="category-edit-form"
                  key={category.id}
                  onSubmit={(event) =>
                    handleUpdateCategory(event, category.id)
                  }
                >
                  <input
                    type="text"
                    value={editName}
                    onChange={(event) =>
                      setEditName(event.target.value)
                    }
                  />

                  <select
                    value={editType}
                    onChange={(event) =>
                      setEditType(event.target.value)
                    }
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>

                  <div className="category-actions">
                    <button type="submit">Save</button>

                    <button
                      type="button"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )
            }

            return (
              <div className="category-item" key={category.id}>
                <span>{category.name}</span>

                <div className="category-actions">
                  <button
                    type="button"
                    onClick={() => startEditing(category)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteCategory(category)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    )
  }

  return (
    <>
      <div className="page-heading">
        <h1>Categories</h1>
        <p>
          Add, edit, and manage categories for your transactions.
        </p>
      </div>

      <div className="category-add-container">
        <h2>Add Category</h2>

        <form
          className="category-add-form"
          onSubmit={handleAddCategory}
        >
          <div className="form-group">
            <label>Category Name</label>

            <input
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

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

          <button type="submit" className="add-button">
            Add Category
          </button>
        </form>
      </div>

      <div className="categories-grid">
        <div className="category-section">
          <h2>Expense Categories</h2>
          {renderCategoryList(expenseCategories)}
        </div>

        <div className="category-section">
          <h2>Income Categories</h2>
          {renderCategoryList(incomeCategories)}
        </div>
      </div>
    </>
  )
}

export default Categories