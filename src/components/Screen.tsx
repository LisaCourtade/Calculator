import React, { useEffect, useRef, useState } from "react";
import { Operation } from "../types";

interface ScreenProps {
  printCurrentValue: () => string;
  value: Operation[];
}

export default function Screen({ printCurrentValue, value }: ScreenProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState<number>(0);
  const [previousValue, setPreviousValue] = useState<Operation[]>(value);

  function splitCurrentValue(currentValue: string): string[] {
    return currentValue.split("");
  }

  function getArea(screenRef: React.RefObject<HTMLDivElement>) {
    let totalArea = 0;
    if (screenRef.current?.children) {
      const { children } = screenRef.current;

      for (let i = 0; i < children.length; i++) {
        let area =
          (children[i].scrollWidth + 1) * (children[i].scrollHeight + 1);
        totalArea += area;
      }
    }
    return totalArea;
  }

  useEffect(() => {
    if (previousValue === value) {
      return;
    }
    const screenArea = screenRef.current ? screenRef.current.clientHeight * screenRef.current.clientWidth : 150 * 192;
    const valueArea = getArea(screenRef);

    //value increase
    if (screenArea - valueArea < 0) {
      if (valueArea >= 28000 && valueArea <= 30000) {
        if (screenRef.current?.classList.contains("small-overflow")) {
          screenRef.current?.classList.remove("small-overflow");
          screenRef.current?.classList.add("medium-overflow");
          return;
        } else if (screenRef.current?.classList.contains("medium-overflow")) {
          screenRef.current?.classList.remove("medium-overflow");
          screenRef.current?.classList.add("big-overflow");
          return;
        } 
      }
      setOverflow(screenArea - valueArea);
    }

    //value decrease
    if (value.length === 1 || (value.length === 2 && value[1].value === "0")) {
      if (`${value[0].value}`.length > 6) {
        setOverflow(-1000);
        return;
      }
      if (screenArea - valueArea < 0) {
        setOverflow(screenArea - valueArea);
      } else {
        setOverflow(0);
      }
    }
    setPreviousValue(value);

    if (screenRef.current?.scrollHeight) {
      screenRef.current.scrollTop = screenRef.current.scrollHeight - screenRef.current.clientHeight;  
    }

  }, [
    screenRef.current?.scrollHeight,
    screenRef.current?.clientHeight,
    value,
    previousValue,
    overflow,
  ]);

  return (
    <div
      ref={screenRef}
      className={`result-screen ${getOverflowClassName(overflow)}`}
    >
      {printCurrentValue() === "" ? (
        <div className="screen-digit">0</div>
      ) : (
        splitCurrentValue(printCurrentValue()).map((value) => {
          return <div className="screen-digit">{value}</div>;
        })
      )}
    </div>
  );
}

function getOverflowClassName(overflow: number): string {
  if (overflow < 0 && overflow > -1000) {
    return "small-overflow";
  }

  if (overflow <= -1000 && overflow > -3000) {
    return "medium-overflow";
  }

  if (overflow <= -3000) {
    return "big-overflow";
  }
  return "normal-overflow";
}
