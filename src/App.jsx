import './App.css'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

function App() {
  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <Header />

        <section className="dashboard">
          <h2>Welcome to Finance Tracker</h2>
          <p>Your financial overview will appear here.</p>
        </section>
      </main>
    </div>
  )
}

export default App