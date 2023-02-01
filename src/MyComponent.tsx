import React, { useState } from 'react';


export function MyComponent(): JSX.Element {

    const [state, setValue] = useState<number[]>([]);

    const increment = () => {
        setValue(prev => [...prev, 1])
    }

     return (
        <div>
            <button onClick={increment}>+</button>
        </div>
    )
}