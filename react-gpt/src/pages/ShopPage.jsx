import { useState } from "react";

import { Container, InputGroup, Row, Form } from "react-bootstrap";

import ProductsFilter from "../components/ProductsFilter";
import ProductDisplay from "../components/ProductDisplay";

import filters from "../data/filters";
    
function ShopPage({ title, category, products}) {

    const actualFilters = filters[category]

    const filterNames = filters[category].map(filter => filter.filterName)

    products.forEach(product => {

        for (const [key, value] of Object.entries(product)) {
            if (filterNames.includes(key)) {
                const newFilter = actualFilters.find(filter => filter.filterName === key)

                if (newFilter.filterType === "Checkbox") {

                    if (!newFilter.filterSubcategories.includes(value)) {
                        newFilter.filterSubcategories.push(value)
                    }

                }    
            }
        }
    })
    
    const [searchQuery, setSearchQuery] = useState('');

    const [filterOptions, setFilterOptions] = useState(
        Object.fromEntries(
            filters[category].map((filter) => {
                if (filter.filterType === "Checkbox") {
                    const filterState = {
                        active: false,
                        type: "Checkbox",
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

    const handleSearchQueryChange = (newValue) => {
        setSearchQuery(currentValue => newValue);
    }

    const handleFilterOptionsChange = (filterOption) => {

        if (filterOption.filterType === "Checkbox") {
            setFilterOptions(currentValue => {
                const previous = currentValue[filterOption.filterName];
    
                const targets = filterOption.checked 
                    ? [...previous.targets, filterOption.value]
                    : previous.targets.filter(target => target !== filterOption.value);
                
                return {
                    ...currentValue,
                    [filterOption.filterName]: {
                        ...previous,
                        targets,
                        active: targets.length > 0
                    }
                }  
            })
        }
    }

    // console.log(filterOptions)

    const visibleProducts = products.filter(product => {
        if (!product.name.toLowerCase().includes(searchQuery.toLowerCase()) 
            && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
        }

        for (const [key, value] of Object.entries(filterOptions)) {
            if (value["active"]) {
                if (value["type"] === "Checkbox") {
                    if (!value["targets"].includes(product[key])) {
                        return false;
                    }
                }
            }
        }

        return true;
    })

    return (
        <Container>
            <Row>
                <aside
                    className="col-12 col-md-4 col-lg-3">
                    
                    <ProductsFilter 
                        title={title} 
                        filterData={filters[category]}
                        onFilter={ handleFilterOptionsChange }
                        onSearch={ handleSearchQueryChange }/>
                </aside>
                <main
                    className="col-12 col-md-8 col-lg-9">
                    <ProductDisplay title={title} productCards={visibleProducts}></ProductDisplay>
                </main>
            </Row>
        </Container>
    )
}

export default ShopPage;