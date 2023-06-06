import React, { useState } from "react";
import "./App.css";
import { Operation, Bracket } from "./types";
import Keyboard from "./components/Keyboard";
import Screen from "./components/Screen";

function App(): JSX.Element {
  const [value, setValue] = useState<Operation[]>([{ value: "" }]);

  const printCurrentValue = (): string => {
    let stringValue = "";
    for (let i = 0; i < value.length; i++) {
      if (value[i].bracket === Bracket.OPEN) {
        stringValue += value[i].bracket;
        stringValue += value[i].value;
        if (value[i].action) {
          stringValue += value[i].action;
        }
      } else if (value[i].bracket === Bracket.CLOSE) {
        stringValue += value[i].value;
        stringValue += value[i].bracket;
        if (value[i].action) {
          stringValue += value[i].action;
        }
      } else {
        stringValue += value[i].value;
        if (value[i].action) {
          stringValue += value[i].action;
        }
      }
    }
    return stringValue;
  };

  return (
    <div className="calculator">
      <Screen printCurrentValue={printCurrentValue} value={value} />
      <Keyboard value={value} setValue={setValue} />
    </div>
  );
}

export default App;
