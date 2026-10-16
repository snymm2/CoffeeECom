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

    const [visibleProducts, setVisibleProducts] = useState(products);

    const handleFilter = (searchQuery, filters) => {
        // Handle Search First
        if (searchQuery.trim()) {
            setVisibleProducts(currentValue => 
            products.filter((product) => 
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) 
                    || product.brand.toLowerCase().includes(searchQuery.toLowerCase())
            ))
        }

        // Handle Filters
        for (const [key, value] of Object.entries(filters)) {
            if (value["active"]) {
                setVisibleProducts(currentValue =>
                    products.filter(product => value["targets"].includes(product[key]))
                )
            }
        }
    }

    return (
        <Container>
            <Row>
                <aside
                    className="col-12 col-md-4 col-lg-3">
                    
                    <ProductsFilter 
                        title={title} 
                        filterData={filters[category]}
                        onFilter={ handleFilter }/>
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