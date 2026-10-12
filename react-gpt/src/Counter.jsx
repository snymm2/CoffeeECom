import { useEffect, useRef, useState } from "react";

import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'

function Counter( {step = 1} ) {
    const [count, setCount] = useState(0);

    function handleClickDecrement() {
        setCount(currentCount => Math.max(0, currentCount - step));
    }

    function handleClickIncrement() {
        setCount(currentCount => currentCount + step);
    }

    const customStyle = {
        width: "100px",
        height: "100px"
    };


    return (
        <>
            <Row
                className="gap-4 col-6 justify-content-around">
                <Button
                    type="button"
                    variant="primary"
                    className="rounded-circle fs-3"
                    aria-label="Decrease Counter"
                    style={customStyle}
                    disabled={count === 0}
                    onClick={handleClickDecrement}>
                    -</Button>
                <span
                    className="d-inline-flex align-items-center justify-content-center border border-2 border-dark rounded fs-2"
                    style={customStyle}>{count}</span>
                <Button
                    type="button"
                    variant="success"
                    className="rounded-circle fs-3"
                    aria-label="Increase Counter"
                    style={customStyle}
                    onClick={handleClickIncrement}>+</Button>
            </Row>

            <Row className="col-6 text-center fs-2">
                <p>Parity: {count % 2 ? "Odd" : "Even"}</p>
                <p>Count is 10: {count === 10 ? "Yes" : "No"}</p>
            </Row>
            
        </>
    );
}

export default Counter