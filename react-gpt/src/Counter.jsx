'use strict'

import { useState } from "react";

import Button from 'react-bootstrap/Button'

function Counter() {

    const [count, setCount] = useState(0);

    function handleClickDecrement() {
        setCount(count - 1);
    }

    function handleClickIncrement() {
        setCount(count + 1);
    }

    const customStyle = {
        width: "60px",
        height: "60px"
    };

    return (
        <>
            <Button 
                variant="primary" 
                className="rounded-circle m-4 text-xl"
                style={customStyle}
                onClick={handleClickDecrement}>-</Button>
            <span class="border border-dark rounded text-center p-2 fs-3" style={customStyle}>{count}</span>
            <Button 
                variant="primary" 
                className="rounded-circle m-4"
                style={customStyle}
                onClick={handleClickIncrement}>+</Button>
        </>
    );
}

export default Counter