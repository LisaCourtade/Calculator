import React, { useState } from 'react';
import './App.css';

function App(): JSX.Element {

  // Calculator's state ( user's query )
  const [value, setValue] = useState<Operation[]>([{ value: 0 }]);

  const handleDigitClick = (e: React.MouseEvent<HTMLDivElement>, val: number): void => {
    e.preventDefault();
    setValue(prev => {
        // 1) Get last element in the `value` array
        const lastEl = prev[prev.length-1];
        // 2) Append new digit to the value field of the object
        lastEl.value = Number(`${lastEl.value}` + `${val}`);
        // 3) Set new value
        console.log(prev);
        return [...prev];
    })

  }

  const handleActionClick = (e: React.MouseEvent<HTMLDivElement>, action: Action): void => {
    e.preventDefault();
    setValue(prev => {
      // 1) Get last element in the `value` array
      const lastEl = prev[prev.length-1];
      // 2) Set action to action field of the element
      lastEl.action = action;
      // 3) Set new value
      console.log(prev);
      return [...prev, { value: 0 }];
    })
  }

  const printCurrentValue = (): string => {
    let stringValue = ``;
    for(let i = 0; i < value.length; i++) {
      stringValue += `${value[i].value}`;
      if (value[i].action) {
        stringValue += `${value[i].action}`;
      }
    }
    return stringValue;
  }

  console.log(value);

  return (
    <div className='calculator'>
        <div className='result-screen'>{printCurrentValue()}</div>
        <div className="all-buttons">
          <div className="row">
            <div className="button light-grey" onClick={e => handleActionClick(e, Action.DELETE)}>C</div>
            <div className="button light-grey">+/-</div>
            <div className="button light-grey">%</div>
            <div className="button orange" onClick={e => handleActionClick(e, Action.DIVIDE)}>/</div>
          </div>
          <div className="row">
            <div className="button" onClick={e => handleDigitClick(e, 7)}>7</div>
            <div className="button" onClick={e => handleDigitClick(e, 8)}>8</div>
            <div className="button" onClick={e => handleDigitClick(e, 9)}>9</div>
            <div className="button orange" onClick={e => handleActionClick(e, Action.MULTIPLY)}>x</div>
          </div>
          <div className="row">
            <div className="button" onClick={e => handleDigitClick(e, 4)}>4</div>
            <div className="button" onClick={e => handleDigitClick(e, 5)}>5</div>
            <div className="button" onClick={e => handleDigitClick(e, 6)}>6</div>
            <div className="button orange" onClick={e => handleActionClick(e, Action.MINUS)}>-</div>
          </div>
          <div className="row">
            <div className="button" onClick={e => handleDigitClick(e, 1)}>1</div>
            <div className="button" onClick={e => handleDigitClick(e, 2)}>2</div>
            <div className="button" onClick={e => handleDigitClick(e, 3)}>3</div>
            <div className="button orange" onClick={e => handleActionClick(e, Action.ADD)}>+</div>
          </div>
          <div className="row">
            <div className="button zero" onClick={e => handleDigitClick(e, 0)}>0</div>
            <div className="button">.</div>
            <div className="button orange" onClick={e => handleActionClick(e, Action.EQUALS)}>=</div>
          </div>
        </div>
    </div>
  );
}


export default App;


interface Operation {
  value: number;
  action?: Action;
}

const enum Action {
  DELETE = 'DELETE',
  ADD = '+',
  MINUS = '-',
  MULTIPLY = 'x',
  DIVIDE = '/',
  EQUALS = '=',
  NEGATE = 'NEGATE',
}
