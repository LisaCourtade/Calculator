import React, { useEffect } from "react";
import { Action, Operation, Bracket } from "../types";

function add(num1: string, num2: string): number {
  return Number(num1) + Number(num2);
}

function minus(num1: string, num2: string): number {
  return Number(num1) - Number(num2);
}

function multiply(num1: string, num2: string): number {
  return Number(num1) * Number(num2);
}

function divide(num1: string, num2: string): number {
  return Number(num1) / Number(num2);
}

function dot(num1: string, num2: string): number {
  return parseFloat(`${num1}.${num2}`);
}

const actionToFunction = {
  [Action.ADD]: add,
  [Action.MINUS]: minus,
  [Action.MULTIPLY]: multiply,
  [Action.DIVIDE]: divide,
  [Action.DOT]: dot,
};

function open(curr: Operation, next: Operation): number {
  let result = 0;
  if (curr.action) {
    result = actionToFunction[curr.action](curr.value, next.value);
  }
  return result;
}

function close() {}

const bracketFunction = {
  [Bracket.OPEN]: open,
  [Bracket.CLOSE]: close,
};

interface KeyBoardProps {
  value: Operation[];
  setValue: React.Dispatch<React.SetStateAction<Operation[]>>;
}

export default function Keyboard({ value, setValue }: KeyBoardProps) {
  const handleDigitClick = (
    e: React.MouseEvent<HTMLDivElement>,
    val: number
  ): void => {
    e.preventDefault();
    const lastEl = value[value.length - 1];
    lastEl.value = `${lastEl.value}${val}`;
    setValue([...value]);
  };

  const handleBracketClick = (
    e: React.MouseEvent<HTMLDivElement>,
    bracket: Bracket
  ): void => {
    e.preventDefault();
    setValue((prev) => {
      const lastEl = prev[prev.length - 1];
      lastEl.bracket = bracket;
      return [...prev];
    });
  };

  const handleActionClick = (
    e: React.MouseEvent<HTMLDivElement>,
    action: Action
  ): void => {
    e.preventDefault();
    // Check if it's already a float number
    if (
      action === Action.DOT &&
      value.length > 1 &&
      value[value.length - 2].action === Action.DOT
    ) {
      return;
    }
    setValue((prev) => {
      const lastEl = prev[prev.length - 1];
      // Check if it's a leading dot
      if (action === Action.DOT && lastEl.value === "") {
        lastEl.value = "0";
      }
      // Set action to action field of the element
      lastEl.action = action;
      return [...prev, { value: "" }];
    });
  };

  const handleKeyboardEvent = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const operators = [".", "+", "-", "*", "/"];
    const lastEl = value[value.length - 1];

    if (numbers.includes(e.key)) {
      lastEl.value = lastEl.value + e.key;
      setValue([...value]);
    } else if (operators.includes(e.key)) {
      // Check if it's already a float number
      if (
        e.key === Action.DOT &&
        value.length > 1 &&
        value[value.length - 2].action === Action.DOT
      ) {
        return;
      }
      // Check if it's a leading dot
      if (e.key === Action.DOT && lastEl.value === "") {
        lastEl.value = "0";
      }
      // Assign Action
      switch (e.key) {
        case ".":
          lastEl.action = Action.DOT;
          break;
        case "+":
          lastEl.action = Action.ADD;
          break;
        case "-":
          lastEl.action = Action.MINUS;
          break;
        case "*":
          lastEl.action = Action.MULTIPLY;
          break;
        case "/":
          lastEl.action = Action.DIVIDE;
          break;
      }
      setValue([...value, { value: "" }]);
    } else if (e.key === "Enter" || e.key === "=") {
      handleEqual();
    } else if (e.key === "Delete") {
      handleDelete();
    }
  };

  const handleEqual = (e?: React.MouseEvent<HTMLDivElement>): void => {
    if (e) {
      e.preventDefault();
    }
    const copy = [...value];
    for (let i = 0; i < copy.length; i++) {
      let inBracket = false;
      if (copy[i].bracket === Bracket.OPEN) {
        inBracket = true;
      }
      for (let k = i; inBracket && k !== copy.length - 1; k++) {
        let bracketResult = bracketFunction[Bracket.OPEN](copy[k], copy[k + 1]);
        copy[k + 1].value = `${bracketResult}`;
        copy.splice(k, 1);
        k--;
        if (copy[k + 1].bracket && copy[k + 1].bracket === Bracket.CLOSE) {
          inBracket = false;
        }
      }
    }
    for (let i = 0; i < copy.length; i++) {
      const currentAction = copy[i].action;
      if (currentAction === Action.DOT) {
        let actionResult = actionToFunction[currentAction](
          copy[i].value,
          copy[i + 1].value
        );
        copy[i + 1].value = `${actionResult}`;
        copy.splice(i, 1);
        i--;
      }
    }
    for (let i = 0; i < copy.length; i++) {
      const currentAction = copy[i].action;
      if (
        currentAction === Action.MULTIPLY ||
        currentAction === Action.DIVIDE
      ) {
        let actionResult = actionToFunction[currentAction](
          copy[i].value,
          copy[i + 1].value
        );
        copy[i + 1].value = `${actionResult}`;
        copy.splice(i, 1);
        i--;
      }
    }
    let allValues = copy[0].value;
    for (let i = 1; i < copy.length; i++) {
      let currentAction = copy[i - 1].action;
      if (currentAction) {
        allValues = `${actionToFunction[currentAction](
          allValues,
          copy[i].value
        )}`;
      }
    }
    if (allValues.length > 12) {
      allValues = `${allValues}`.slice(0, 12);
    }
    const result = [{ value: allValues }];
    setValue(result);
  };

  const handleDelete = () => {
    setValue([{ value: "" }]);
  };

  useEffect(() => {
    (document.querySelector('.all-buttons') as HTMLDivElement).focus();
  }, []);

  return (
    <div className="all-buttons" onKeyDown={handleKeyboardEvent} tabIndex={1}>
      <div className="row">
        <div className="button light-grey" onClick={() => handleDelete()}>C</div>
        <div className="button light-grey" onClick={e => handleBracketClick(e, Bracket.OPEN)}>(</div>
        <div className="button light-grey" onClick={e => handleBracketClick(e, Bracket.CLOSE)}>)</div>
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
        <div className="zero" onClick={e => handleDigitClick(e, 0)}>0</div>
        <div className="button" onClick={e => handleActionClick(e, Action.DOT)}>.</div>
        <div className="button orange" onClick={e => handleEqual(e)}>=</div>
      </div>
    </div>
  );
}
