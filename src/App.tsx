import React, { useState } from 'react';
import './App.css';

interface Operation {
  value: number;
  action?: Action;
}

const enum Action {
  ADD = '+',
  MINUS = '-',
  MULTIPLY = 'x',
  DIVIDE = '/',
  DOT = '.',
}

function add(num1: number, num2: number): number {
  return num1 + num2;
}

function minus(num1: number, num2: number): number {
  return num1 - num2;
}

function multiply(num1: number, num2: number): number {
  return num1 * num2;
}

function divide(num1: number, num2: number): number {
  return num1 / num2;
}

function dot(num1: number, num2: number): number {
  return parseFloat(`${num1}.${num2}`);
}

const actionToFunction = {
  [Action.ADD]: add,
  [Action.MINUS]: minus,
  [Action.MULTIPLY]: multiply,
  [Action.DIVIDE]: divide,
  [Action.DOT]: dot,
}

function App(): JSX.Element {
  // Calculator's state ( user's query )
  const [value, setValue] = useState<Operation[]>([{ value: 0 }]);

  const handleDigitClick = (e: React.MouseEvent<HTMLDivElement>, val: number): void => {
    e.preventDefault();
    // 1) Get last element in the `value` array
    const lastEl = value[value.length-1];
    // 2) Append new digit to the value field of the object
    lastEl.value = Number(`${lastEl.value}` + `${val}`);
    // 3) Set new value
    setValue([...value]);
  }

  const handleActionClick = (e: React.MouseEvent<HTMLDivElement>, action: Action): void => {
    e.preventDefault();
      setValue(prev => {
        // 1) Get last element in the `value` array
        const lastEl = prev[prev.length-1];
        // 2) Set action to action field of the element
        lastEl.action = action;
        // 3) Set new value
        return [...prev, { value: 0 }];
      })
  }

  const handleEqualClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const copy = [...value];
    for (let i = 0; i < copy.length; i++) {
      const currentAction = copy[i].action;
      if (currentAction === Action.MULTIPLY || currentAction === Action.DIVIDE) {
        let actionResult = actionToFunction[currentAction](copy[i].value, copy[i+1].value);
        copy[i+1].value = actionResult;
        copy.splice(i, 1);
        i--;
      }
    }
    let allValues = copy[0].value;
    for (let i = 1; i < copy.length; i++) {
      let currentAction = copy[i-1].action;
      if (currentAction) {
        allValues = actionToFunction[currentAction](allValues, copy[i].value);
      }
    }
    const result = [{value: allValues}];
    setValue(result);
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



  return (
    <div className='calculator'>
        <div className='result-screen'>{printCurrentValue()}</div>
        <div className="all-buttons">
          <div className="row">
            <div className="button light-grey" onClick={() => {setValue([{value: 0}])}}>C</div>
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
            <div className="button" onClick={e => handleActionClick(e, Action.DOT)}>.</div>
            <div className="button orange" onClick={e => handleEqualClick(e)}>=</div>
          </div>
        </div>
    </div>
  );
}



export default App;



