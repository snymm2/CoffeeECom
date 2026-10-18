import { useEffect, useState } from "react";

import { Card, Form, InputGroup } from "react-bootstrap";

function ProductsFilter({ title, filterData, onFilter, onSearch }) {

    const handleSearchQuery = (event) => {
        onSearch(event.target.value);
    }

    const handleCheck = (event) => {
        if (event.target.type === "checkbox")
        {
            onFilter({
                filterName: event.target.name,
                filterType: "Checkbox",
                checked: event.target.checked,
                value: event.target.value
            })
        }
    }
    
    return (
        <>
        <InputGroup
            className="mb-4 shadow">
            <Form.Control
                type="search"
                placeholder={`Search ${title.toLowerCase()}...`}
                aria-label={`Search ${title}`}
                onChange={ handleSearchQuery }/>
        </InputGroup>
        {
            filterData.map((filter) => {
                if (filter.filterType === "Checkbox") {
                    return <Card
                        key={filter.filterName}
                        className="p-3 shadow-sm mb-3">
                        <Card.Title className="mb-3">{filter.filterLabel}</Card.Title>
                        {
                            filter.filterSubcategories.map((subcategory) => (
                                <Form.Check 
                                    key={ subcategory } 
                                    type="checkbox"
                                    name={filter.filterName}
                                    value={subcategory}
                                    label={subcategory}
                                    onChange={ handleCheck }/>
                            ))
                        }
                    </Card>
                }

                if (filter.filterType === "Range") {
                    return <Card
                        key={filter.filterName}
                        className="p-3 shadow-sm mb-3">
                        <Card.Title className="mb-3">{filter.filterLabel}</Card.Title>
                        <Form.Range
                            min={filter.filterMin}
                            max={filter.filterMax}
                            step={1}
                        />
                        <Card.Text
                            className="d-flex justify-content-between">
                            <span>Rs. {filter.filterMin}</span>
                            <span>Rs. {filter.filterMax}</span>
                        </Card.Text>
                    </Card>
                }
            })
        }
        </>
    )
}

export default ProductsFilter;