function ModeOne({ amount, percentage, onAmountChange, onPercentageChange }) {
  return (
    <div className="inputs-grid">
      <label className="field">
        <span>Total Amount</span>
        <input
          type="number"
          min="0"
          step="any"
          placeholder="e.g. 1000"
          value={amount}
          onChange={(event) => onAmountChange(event.target.value)}
        />
      </label>
      <label className="field">
        <span>Percentage (%)</span>
        <input
          type="number"
          min="0"
          step="any"
          placeholder="e.g. 10"
          value={percentage}
          onChange={(event) => onPercentageChange(event.target.value)}
        />
      </label>
    </div>
  )
}
export default ModeOne
