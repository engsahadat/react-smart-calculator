function Result({ label, value, helper, error }) {
  return (
    <div className={`result-card ${error ? 'error' : ''}`}>
      <div className="result-header">
        <p className="result-title">{label}</p>
        {helper && <span className="result-helper">{helper}</span>}
      </div>
      <div className="result-body">
        {error ? <p className="result-error">{error}</p> : <p className="result-value">{value}</p>}
      </div>
    </div>
  )
}
export default Result
