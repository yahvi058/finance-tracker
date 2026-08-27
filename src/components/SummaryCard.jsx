function SummaryCard({ title, amount }) {
  return (
    <div className="summary-card">
      <p className="summary-title">{title}</p>
      <h2>{amount}</h2>
    </div>
  )
}

export default SummaryCard