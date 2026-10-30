import { useState } from "react";

import { Card, Form } from "react-bootstrap";

function SliderFilter({filter, selectedValue, onFilter}) {

    const handleSliderChange = (event) => {
        onFilter({
            filterName: filter.filterName,
            filterType: "Range",
            value: Number(event.target.value)
        })
    }

    return (
    <Card
        className="p-3 shadow-sm mb-3">

        <Card.Title className="mb-3">{filter.filterLabel}</Card.Title>

        <Form.Label>Maximum Price: <strong>{selectedValue}</strong></Form.Label>

        <Form.Range
            min={filter.filterMin}
            max={filter.filterMax}
            value={selectedValue}
            step={10}
            onChange={ handleSliderChange }
        />
        <Card.Text
            className="d-flex justify-content-between">
            <span>Rs. {filter.filterMin}</span>
            <span>Rs. {filter.filterMax}</span>
        </Card.Text>
    </Card>
    )
}

export default SliderFilter;