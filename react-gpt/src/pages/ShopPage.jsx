import { useState } from "react";

import { Container, Row } from "react-bootstrap";

import ProductsFilter from "../components/ProductsFilter";
import ProductDisplay from "../components/ProductDisplay";

import filters from "../data/filters";
import SiteNavbar from "../components/layout/SiteNavbar";
    
function ShopPage({ title, category, products}) {

    const actualFilters = [];

    filters[category].forEach((filter) => {
        if (filter.filterType === "Checkbox") {
            const availables = [...new Set(products.map(product => product[filter.filterName]).filter(Boolean))]

            const actualFilter = {
                ...filter,
                filterSubcategories: availables
            }

            actualFilters.push(actualFilter);
        } else if (filter.filterType === "Range") {

            const values = products.map(product => product[filter.filterName]).filter(Number.isFinite);
            const minValue = values.length ? Math.min(...values) : 0;
            const maxValue = values.length ? Math.max(...values) : 0;

            const actualFilter = {
                ...filter,
                filterMin: minValue,
                filterMax: maxValue,
            }

            actualFilters.push(actualFilter);
        }
    })

    const [searchQuery, setSearchQuery] = useState('');

    const [sortBy, setSortBy] = useState("featured");

    const [filterOptions, setFilterOptions] = useState(
        Object.fromEntries(
            actualFilters.map((filter) => {
                if (filter.filterType === "Checkbox") {
                    const filterState = {
                        active: false,
                        type: "Checkbox",
                        targets: []
                    }
                    return [filter.filterName, filterState];
                } else if (filter.filterType === "Range") {
                    const filterState = {
                        active: true,
                        type: filter.filterType,
                        min: filter.filterMin,
                        max: filter.filterMax,
                        current: filter.filterMax
                    }
                    return [filter.filterName, filterState];
                }
            })
        )
    );

    const handleSearchQueryChange = (newValue) => {
        setSearchQuery(newValue);
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
        } else if (filterOption.filterType === "Range") {
            setFilterOptions(currentValue => {
                const previous = currentValue[filterOption.filterName];
                return {
                    ...currentValue,
                    [filterOption.filterName]: {
                        ...previous,
                        current: filterOption.value
                    }
                }
            })
        }
    }

    const visibleProducts = products.filter(product => {
        if (!product.name.toLowerCase().includes(searchQuery.toLowerCase()) 
            && !product.brand.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
        }

        for (const [key, value] of Object.entries(filterOptions)) {
            if (value["active"]) {
                if (value["type"] === "Checkbox") {
                    if (!value["targets"].includes(product[key])) {
                        return false;
                    }
                }
                if (value["type"] === "Range") {
                    if (product[key] > value["current"]) {
                        return false;
                    }
                }
            }
        }

        return true;
    })

    const sortedProducts = [...visibleProducts].sort((a, b) => {
        const priceA = Math.round(
            a.price * (1 - (a.discountPercent || 0))
        );

        const priceB = Math.round(
            b.price * (1 - (b.discountPercent || 0))
        );

        switch (sortBy) {
            case "name-asc":
                return a.name.localeCompare(b.name);
            
            case "price-asc":
                return priceA - priceB;
            
            case "price-desc":
                return priceB - priceA;

            case "rating-desc":
                return (b.ratingAvg ?? -1) - (a.ratingAvg ?? -1);

            case "popular":
                return (b.ratingTotal ?? 0) - (a.ratingTotal ?? 0);
            
            case "discount-desc":
                return (b.discountPercent ?? 0) - (a.discountPercent ?? 0);
            
            case "featured":
            default:
                return Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured));
        }
    });

    return (
        <>
        <SiteNavbar context="shop" />

        <Container
            className="py-4"
            fluid
            style={{backgroundColor: "#F5F0E6"}}>
            <Row>
                <aside
                    className="col-12 col-md-4 col-lg-3">
                    
                    <ProductsFilter 
                        title={title}
                        key={category}
                        filterData={ actualFilters }
                        filterOptions={filterOptions}
                        onFilter={ handleFilterOptionsChange }
                        onSearch={ handleSearchQueryChange }/>
                </aside>
                <main
                    className="col-12 col-md-8 col-lg-9">
                    <ProductDisplay 
                        key={category} 
                        title={title} 
                        productCards={sortedProducts}
                        sortBy={sortBy}
                        onSortChange={setSortBy}></ProductDisplay>
                </main>
            </Row>
        </Container>
        </>
    )
}

export default ShopPage;