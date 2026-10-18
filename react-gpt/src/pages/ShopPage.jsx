import { useState } from "react";

import { Container, InputGroup, Row, Form } from "react-bootstrap";

import ProductsFilter from "../components/ProductsFilter";
import ProductDisplay from "../components/ProductDisplay";

const filters = {
    "coffee": [
        {
            filterName: "type",
            filterLabel: "Types",
            filterType: "Checkbox",
            filterSubcategories: ["Coffee Beans", "Ground Coffee", "Instant Coffee", "Syrups"]
        },
        {
            filterName: "brand",
            filterLabel: "Brands",
            filterType: "Checkbox",
            filterSubcategories: ["Nations", "Himalayan Brew", "Everest Roasters", "Origin Select", "Bold Bean", "Daily Grind", "Green Mountain"]
        },
        {   
            filterName: "coffeeType",
            filterLabel: "Coffee Type",
            filterType: "Checkbox",
            filterSubcategories: ["Arabica", "Robusta", "Blend"]
        },
        {   
            filterName: "price",
            filterLabel: "Price Range",
            filterType: "Range",
            filterMin: 0,
            filterMax: 100
        },
    ],
    "equipment": [
        {
            filterName: "Types",
            filterType: "Checkbox",
            filterSubcategories: ["Category 1", "Category 2", "Category 3", "Category 4"]
        },
        {
            filterName: "Brands",
            filterType: "Checkbox",
            filterSubcategories: ["Brand 1", "Brand 2", "Brand 3", "Brand 4"]
        },
        {
            filterName: "Price Range",
            filterType: "Range",
            filterMin: 0,
            filterMax: 100
        },
    ],
    "merch": [
        {
            filterName: "Categories",
            filterType: "Checkbox",
            filterSubcategories: ["Category 1", "Category 2", "Category 3", "Category 4"]
        },
        {
            filterName: "Brands",
            filterType: "Checkbox",
            filterSubcategories: ["Brand 1", "Brand 2", "Brand 3", "Brand 4"]
        },
        {
            filterName: "Price Range",
            filterType: "Range",
            filterMin: 0,
            filterMax: 100
        },
    ]
};
    
function ShopPage({ title, category, products}) {

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

    console.log(filterOptions)

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