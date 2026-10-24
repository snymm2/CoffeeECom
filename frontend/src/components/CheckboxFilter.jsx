import { useState } from "react"

import { Card, Form } from "react-bootstrap"

function CheckboxFilter({filter, selectedValues, onCheck}) {

    const handleCheck = (event) => {
        onCheck({
            filterName: filter.filterName,
            filterType: "Checkbox",
            checked: event.target.checked,
            value: event.target.value
        });
    }

    return (
    <Card
        className="p-3 shadow-sm mb-3">
        <Card.Title className="mb-3">{filter.filterLabel}</Card.Title>
        {
            filter.filterSubcategories.map((subcategory) => (
                <Form.Check
                    key={subcategory}
                    type="checkbox"
                    name={filter.filterName}
                    value={subcategory}
                    label={subcategory}
                    checked = {selectedValues.includes(subcategory)}
                    onChange={handleCheck} />
            ))
        }
    </Card>

    )
}

export default CheckboxFilter