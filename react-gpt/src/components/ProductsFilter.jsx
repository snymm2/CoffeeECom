import { useEffect, useState } from "react";

import { Card, Form, InputGroup } from "react-bootstrap";

function ProductsFilter({ title, filterData, onFilter }) {
    const [searchQuery, setSearchQuery] = useState("")

    const [filters, setFilters] = useState(
        Object.fromEntries(
            filterData.map((filter) => {
                if (filter.filterType === "Checkbox") {
                    const filterState = {
                        active: false,
                        type: filter.filterType,
                        targets: []
                    }
                    return [filter.filterName, filterState];
                } else if (filter.filterType === "Range") {
                    const filterState = {
                        active: false,
                        type: filter.filterType,
                        min: filter.filterMin,
                        max: filter.filterMax
                    }
                    return [filter.filterName, filterState];
                }
            })
        )
    );

    const handleSearchQuery = (event) => {
        setSearchQuery(event.target.value);
    }

    const handleCheck = (event) => {
        const filterName = event.target.name;
        if (event.target.type === "checkbox")
        {
            if (event.target.checked) {
                setFilters(currentValue => ({
                    ...currentValue,
                    [filterName]: {
                        ...currentValue[filterName],
                        active: true,
                        targets: [...currentValue[filterName].targets, event.target.value]
                    }
                }));
            } else {
                setFilters(currentValue => ({
                    ...currentValue,
                    [filterName]: {
                        ...currentValue[filterName],
                        targets: currentValue[filterName].targets.filter(target => target !== event.target.value),
                        active: (currentValue[filterName].targets.length === 1) ? false : true
                    }
                }))
            }
        }
    }

    useEffect(() => {
        onFilter(searchQuery, filters)
    }, [searchQuery, filters])
    
    return (
        <>
        <InputGroup
            className="mb-4 shadow">
            <Form.Control
                type="search"
                placeholder={`Search ${title.toLowerCase()}...`}
                aria-label={`Search ${title}`}
                value={searchQuery}
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