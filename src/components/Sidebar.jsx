import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Finance Tracker</h2>

      <nav>
        <Link to="/">
          <button>Dashboard</button>
        </Link>

        <Link to="/transactions">
          <button>Transactions</button>
        </Link>

        <Link to="/budgets">
          <button>Budgets</button>
        </Link>

        <Link to="/categories">
          <button>Categories</button>
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar