import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Display from './Display';
import Button from './Button';
import './App.css';

const Calculator = () => {
  const [currentInput, setCurrentInput] = useState('0');
  const [error, setError] = useState(false);
  const inputRef = useRef(null);

  const calculate = () => {
    try {
      const expr = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
      const tokens = expr.match(/(\d*\.?\d+|[+\-*/])/g) || [];
      if (tokens.length < 3 && tokens.length !== 1) throw new Error();

      let result = parseFloat(tokens[0]);
      let i = 1;
      while (i < tokens.length) {
        const op = tokens[i];
        const num = parseFloat(tokens[i + 1]);
        switch (op) {
          case '+': result += num; break;
          case '-': result -= num; break;
          case '*': result *= num; break;
          case '/':
            if (num === 0) throw new Error('Division by zero');
            result /= num;
            break;
          default: throw new Error();
        }
        i += 2;
      }

      if (!isFinite(result)) throw new Error();
      const rounded = Math.round(result * 1e8) / 1e8;
      setCurrentInput(rounded.toString());
      setError(false);
    } catch {
      setError(true);
      setTimeout(() => {
        setCurrentInput('0');
        setError(false);
      }, 1400);
    }
  };

  const append = (value) => {
    if (error) return;
    if (currentInput === '0' && value !== '.') {
      setCurrentInput(value);
    } else if (value === '.' && currentInput.split(/[\+\-×÷]/).pop().includes('.')) {
      return;
    } else {
      setCurrentInput((prev) => prev + value);
    }
  };

  const clear = () => {
    setCurrentInput('0');
    setError(false);
  };

  const backspace = () => {
    if (error) return;
    setCurrentInput((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      e.preventDefault();

      const k = e.key;
      if (/[0-9]/.test(k) || k === '.') append(k);
      else if (['+', '-', '*', '/'].includes(k)) append(k === '*' ? '×' : k);
      else if (k === 'Enter' || k === '=') calculate();
      else if (k === 'Backspace') backspace();
      else if (k === 'Escape') clear();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentInput, error]);

  return (
    <motion.div
      className="calculator"
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <AnimatePresence mode="wait">
        <Display
          value={error ? 'Error' : currentInput}
          ref={inputRef}
          key={currentInput + (error ? '-err' : '')}
        />
      </AnimatePresence>

      <div className="button-grid">
        <Button className="btn-clear" onClick={clear}        >C</Button>
        <Button className="btn-clear" onClick={backspace}    >⌫</Button>
        <Button className="btn-op"    onClick={() => append('÷')}>÷</Button>
        <Button className="btn-op"    onClick={() => append('×')}>×</Button>

        <Button className="btn-num"   onClick={() => append('7')}>7</Button>
        <Button className="btn-num"   onClick={() => append('8')}>8</Button>
        <Button className="btn-num"   onClick={() => append('9')}>9</Button>
        <Button className="btn-op"    onClick={() => append('-')}>-</Button>

        <Button className="btn-num"   onClick={() => append('4')}>4</Button>
        <Button className="btn-num"   onClick={() => append('5')}>5</Button>
        <Button className="btn-num"   onClick={() => append('6')}>6</Button>
        <Button className="btn-op"    onClick={() => append('+')}>+</Button>

        <Button className="btn-num"   onClick={() => append('1')}>1</Button>
        <Button className="btn-num"   onClick={() => append('2')}>2</Button>
        <Button className="btn-num"   onClick={() => append('3')}>3</Button>
        <Button className="btn-equals" onClick={calculate}    >=</Button>

        <Button className="btn-num zero" onClick={() => append('0')}>0</Button>
        <Button className="btn-num"   onClick={() => append('.')} >.</Button>
      </div>
    </motion.div>
  );
};

export default Calculator;