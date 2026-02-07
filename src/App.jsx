import { useEffect, useMemo, useState } from 'react'
import ModeOne from './components/ModeOne'
import ModeTwo from './components/ModeTwo'
import Result from './components/Result'
import NormalCalculator from './components/NormalCalculator'
import './styles.css'

const MODES = {
  AMOUNT_TO_PERCENT: 'amount-to-percent',
  PERCENT_TO_AMOUNT: 'percent-to-amount',
}

const VIEWS = {
  HOME: 'home',
  SMART: 'smart',
  NORMAL: 'normal',
}

const HISTORY_KEY = 'calculatorHistory'
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000

const formatNumber = (value) => {
  if (Number.isNaN(value) || value === null) return '--'
  const rounded = Math.round(value * 100) / 100
  return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(2)
}

const loadHistory = () => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const saveHistory = (items) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items))
}

const trimHistory = (items) => {
  const now = Date.now()
  return items.filter((item) => now - item.timestamp <= THREE_DAYS_MS)
}

function App() {
  const [view, setView] = useState(VIEWS.HOME)
  const [mode, setMode] = useState(MODES.AMOUNT_TO_PERCENT)
  const [amount, setAmount] = useState('')
  const [percentage, setPercentage] = useState('')
  const [value, setValue] = useState('')
  const [history, setHistory] = useState([])

  useEffect(() => {
    const cleaned = trimHistory(loadHistory())
    setHistory(cleaned)
    saveHistory(cleaned)
  }, [])

  const { resultLabel, resultValue, helper, error, afterDeductionValue } = useMemo(() => {
    const parsedAmount = Number.parseFloat(amount)
    if (!amount || Number.isNaN(parsedAmount)) {
      return {
        resultLabel: 'Result',
        resultValue: '--',
        helper: '',
        error: amount ? 'Enter a valid amount.' : 'Please enter both fields value.',
        afterDeductionValue: '--',
      }
    }

    if (parsedAmount < 0) {
      return {
        resultLabel: 'Result',
        resultValue: '--',
        helper: '',
        error: 'Amount cannot be negative.',
        afterDeductionValue: '--',
      }
    }

    if (mode === MODES.AMOUNT_TO_PERCENT) {
      const parsedPercentage = Number.parseFloat(percentage)
      if (!percentage || Number.isNaN(parsedPercentage)) {
        return {
          resultLabel: 'Calculated Value',
          resultValue: '--',
          helper: 'Result = (Amount × Percentage) / 100',
          error: percentage ? 'Enter a valid percentage.' : 'Please enter both fields value.',
          afterDeductionValue: '--',
        }
      }

      if (parsedPercentage < 0) {
        return {
          resultLabel: 'Calculated Value',
          resultValue: '--',
          helper: 'Result = (Amount × Percentage) / 100',
          error: 'Percentage cannot be negative.',
          afterDeductionValue: '--',
        }
      }

      const calculated = (parsedAmount * parsedPercentage) / 100
      return {
        resultLabel: 'Calculated Value',
        resultValue: formatNumber(calculated),
        helper: 'Result = (Amount × Percentage) / 100',
        error: '',
        afterDeductionValue: formatNumber(parsedAmount - calculated),
      }
    }

    const parsedValue = Number.parseFloat(value)
    if (!value || Number.isNaN(parsedValue)) {
      return {
        resultLabel: 'Calculated Percentage',
        resultValue: '--',
        helper: 'Percentage = (Value × 100) / Amount',
        error: value ? 'Enter a valid value.' : 'Please enter both fields Value.',
        afterDeductionValue: '--',
      }
    }

    if (parsedValue < 0) {
      return {
        resultLabel: 'Calculated Percentage',
        resultValue: '--',
        helper: 'Percentage = (Value × 100) / Amount',
        error: 'Value cannot be negative.',
        afterDeductionValue: '--',
      }
    }

    if (parsedAmount === 0) {
      return {
        resultLabel: 'Calculated Percentage',
        resultValue: '--',
        helper: 'Percentage = (Value × 100) / Amount',
        error: 'Amount must be greater than 0.',
        afterDeductionValue: '--',
      }
    }

    const calculated = (parsedValue * 100) / parsedAmount
    return {
      resultLabel: 'Calculated Percentage',
      resultValue: `${formatNumber(calculated)}%`,
      helper: 'Percentage = (Value × 100) / Amount',
      error: '',
        afterDeductionValue: formatNumber(parsedAmount - parsedValue),
    }
  }, [amount, mode, percentage, value])

  const handleReset = () => {
    setAmount('')
    setPercentage('')
    setValue('')
  }

  const addHistoryItem = (item) => {
    const updated = trimHistory([item, ...history]).slice(0, 20)
    setHistory(updated)
    saveHistory(updated)
  }

  const handleSmartCalculate = () => {
    if (error) return
    const summary =
      mode === MODES.AMOUNT_TO_PERCENT
        ? `Amount ${amount} at ${percentage}% = ${resultValue}`
        : `Value ${value} of ${amount} = ${resultValue}`
    addHistoryItem({
      id: crypto.randomUUID(),
      type: 'smart',
      timestamp: Date.now(),
      summary,
      data: {
        mode,
        amount,
        percentage: mode === MODES.AMOUNT_TO_PERCENT ? percentage : '',
        value: mode === MODES.PERCENT_TO_AMOUNT ? value : '',
      },
    })
  }

  const handleNormalResult = (summary) => {
    addHistoryItem({
      id: crypto.randomUUID(),
      type: 'normal',
      timestamp: Date.now(),
      summary,
    })
  }

  const handleHistoryClick = (item) => {
    if (item.type === 'smart' && item.data) {
      setView(VIEWS.SMART)
      setMode(item.data.mode)
      setAmount(item.data.amount)
      setPercentage(item.data.percentage || '')
      setValue(item.data.value || '')
    }
  }

  return (
    <div className="app-shell">
      <main className="app-card">
        {view !== VIEWS.HOME && (
          <button type="button" className="back-button" onClick={() => setView(VIEWS.HOME)}>
            ← Back to selection
          </button>
        )}

        {view === VIEWS.HOME && (
          <section className="home-grid">
            <div className="home-card">
              <h2>Percentage Calculator</h2>
              <p>Best for percentage-based calculations with instant results and deductions.</p>
              <button type="button" className="primary-btn" onClick={() => setView(VIEWS.SMART)}>
                Open Smart Calculator
              </button>
            </div>
            <div className="home-card">
              <h2>Calculator</h2>
              <p>Quickly add, subtract, multiply, and divide with a clean interface.</p>
              <button type="button" className="secondary-btn" onClick={() => setView(VIEWS.NORMAL)}>
                Open Calculator
              </button>
            </div>
          </section>
        )}

        {view === VIEWS.SMART && (
          <>
            <header className="header">
              <h1>Percentage Calculator</h1>
              <p>
                Quickly calculate percentage values or the percentage of a value. The result updates
                instantly for fast decisions.
              </p>
            </header>

            <section className="mode-toggle">
              <button
                type="button"
                className={`toggle-button ${mode === MODES.AMOUNT_TO_PERCENT ? 'active' : ''}`}
                onClick={() => setMode(MODES.AMOUNT_TO_PERCENT)}
              >
                Amount → Percentage
              </button>
              <button
                type="button"
                className={`toggle-button ${mode === MODES.PERCENT_TO_AMOUNT ? 'active' : ''}`}
                onClick={() => setMode(MODES.PERCENT_TO_AMOUNT)}
              >
                Percentage → Amount
              </button>
            </section>

            {mode === MODES.AMOUNT_TO_PERCENT ? (
              <ModeOne
                amount={amount}
                percentage={percentage}
                onAmountChange={setAmount}
                onPercentageChange={setPercentage}
              />
            ) : (
              <ModeTwo amount={amount} value={value} onAmountChange={setAmount} onValueChange={setValue} />
            )}

            <section className="actions">
              <button type="button" className="primary-btn" onClick={handleSmartCalculate}>
                Calculate
              </button>
              <button type="button" className="secondary-btn" onClick={handleReset}>
                Reset
              </button>
            </section>

            <Result label={resultLabel} value={resultValue} helper={helper} error={error} />
            <Result
              label="Amount After Deduction"
              value={afterDeductionValue}
              helper="Total amount minus deduction"
              error={error}
            />
          </>
        )}

        {view === VIEWS.NORMAL && (
          <>
            <header className="header">
              <h1>Calculator</h1>
              <p>Simple four-operator calculator with instant results.</p>
            </header>
            <NormalCalculator onResult={handleNormalResult} />
          </>
        )}

        {view !== VIEWS.HOME && (
          <section className="history">
            <div className="history-header">
              <h3>Last 3 Days History</h3>
              <span>{history.length} items</span>
            </div>
            {history.length === 0 ? (
              <p className="footer-note">No history yet. Your calculations will appear here.</p>
            ) : (
              <ul className="history-list">
                {history.map((item) => (
                  <li
                    key={item.id}
                    className="history-item"
                    onClick={() => handleHistoryClick(item)}
                    style={{ cursor: item.type === 'smart' ? 'pointer' : 'default' }}
                  >
                    <p>{item.summary}</p>
                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        <p className="footer-note">Develop by eng.md.sahadathossain@gmail.com, Built with React.</p>
      </main>
    </div>
  )
}

export default App
