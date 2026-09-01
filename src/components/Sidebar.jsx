import { useState } from 'react'
import { Link } from 'react-router-dom'

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const closeSidebar = () => {
    setIsOpen(false)
  }

  return (
    <>
      <header className="mobile-header">
        <h2>Finance Tracker</h2>

        <button
          className="mobile-menu-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
        >
          ☰
        </button>
      </header>

      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Finance Tracker</h2>

          <button
            className="sidebar-close-button"
            onClick={closeSidebar}
            aria-label="Close navigation menu"
          >
            ✕
          </button>
        </div>

        <nav>
          <Link to="/" onClick={closeSidebar}>
            <button>Dashboard</button>
          </Link>

          <Link to="/transactions" onClick={closeSidebar}>
            <button>Transactions</button>
          </Link>

          <Link to="/budgets" onClick={closeSidebar}>
            <button>Budgets</button>
          </Link>

          <Link to="/categories" onClick={closeSidebar}>
            <button>Categories</button>
          </Link>

          <Link to="/monthly-summary" onClick={closeSidebar}>
            <button>Monthly Summary</button>
          </Link>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar