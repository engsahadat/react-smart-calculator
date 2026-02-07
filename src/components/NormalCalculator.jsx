import { useState } from 'react'
import '../calculator.css'

function NormalCalculator({ onResult }) {
  const [inputValue, setInputValue] = useState('')
  const display = (value) => setInputValue((prev) => prev + value)
  const calculate = () => {
    try {
      const result = eval(inputValue || '0')
      setInputValue(String(result))
      if (onResult) {
        onResult(`${inputValue} = ${result}`)
      }
    } catch {
      setInputValue('Error')
    }
  }
  const clear = () => setInputValue('')
  return (
    <form className="calculator" name="calc" onSubmit={(event) => event.preventDefault()}>
      <input type="text" className="value" value={inputValue} readOnly />

      <span onClick={() => display('7')}>7</span>
      <span onClick={() => display('8')}>8</span>
      <span onClick={() => display('9')}>9</span>
      <span className="operator" onClick={() => display('/')}>÷</span>
      
      <span onClick={() => display('4')}>4</span>
      <span onClick={() => display('5')}>5</span>
      <span onClick={() => display('6')}>6</span>
      <span className="operator" onClick={() => display('*')}>×</span>
      
      <span onClick={() => display('1')}>1</span>
      <span onClick={() => display('2')}>2</span>
      <span onClick={() => display('3')}>3</span>
      <span className="operator" onClick={() => display('-')}>−</span>
      
      <span onClick={() => display('0')}>0</span>
      <span onClick={() => display('.')}>.</span>
      <span className="num equal" onClick={() => calculate()}>=</span>
      <span className="operator" onClick={() => display('+')}>+</span>
      
      <span className="num clear" onClick={() => clear()}>Clear</span>
    </form>
  )
}

export default NormalCalculator
