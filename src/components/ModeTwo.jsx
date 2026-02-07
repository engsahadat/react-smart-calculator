function ModeTwo({ amount, value, onAmountChange, onValueChange }) {
  return (
    <div className="inputs-grid">
      <label className="field">
        <span>Total Amount</span>
        <input
          type="number"
          min="0"
          step="any"
          placeholder="e.g. 500"
          value={amount}
          onChange={(event) => onAmountChange(event.target.value)}
        />
      </label>
      <label className="field">
        <span>Percentage Value</span>
        <input
          type="number"
          min="0"
          step="any"
          placeholder="e.g. 50"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
        />
      </label>
    </div>
  )
}
export default ModeTwo
