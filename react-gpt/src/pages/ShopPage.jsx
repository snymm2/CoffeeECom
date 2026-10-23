import { useEffect, useState, useMemo } from "react";

import { Container, Row } from "react-bootstrap";

import ProductsFilter from "../components/ProductsFilter";
import ProductDisplay from "../components/ProductDisplay";

import filters from "../data/filters";
import SiteNavbar from "../components/layout/SiteNavbar";

import { fetchProducts } from '../services/productService';

function createInitialFilterOptions(actualFilters) {

    return Object.fromEntries(
        actualFilters.map((filter) => {
            if (filter.filterType === "Checkbox") {
                const filterState = {
                    active: false,
                    type: "Checkbox",
                    targets: []
                }
                return [filter.filterName, filterState];
            }

            if (filter.filterType === "Range") {
                const filterState = {
                    active: true,
                    type: filter.filterType,
                    min: filter.filterMin,
                    max: filter.filterMax,
                    current: filter.filterMax
                }
                return [filter.filterName, filterState];
            }

            return null;
        }).filter(Boolean)
    )

}

function buildApiFilters(filterOptions) {
    const result = {};

    for (const [filterName, filterValues] of Object.entries(filterOptions)){
        if (!filterValues?.active) continue;

        if (filterValues.type === "Checkbox") {
            if (filterValues.targets?.length) {
                result[filterName] = filterValues.targets;
            }
        }

        if (filterValues.type === "Range") {
            if (filterValues.current) {
                result[filterName] = {
                    min: filterValues.min,
                    max: filterValues.current
                }
            }
        }
    }

    return result;
}
    
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

    const [filterOptions, setFilterOptions] = useState(() => createInitialFilterOptions(actualFilters));

    useEffect(() => {
        setFilterOptions(createInitialFilterOptions(actualFilters));
        setCurrentPage(1);
    }, [category]);

    const [backendProducts, setBackendProducts] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        totalItems: 0,
        totalPages: 0  
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState("featured");

    const apiFilters = useMemo(() => buildApiFilters(filterOptions), [filterOptions]);

    useEffect(() => {
        let cancelled = false;

        async function loadProducts() {
            setIsLoading(true);
            setError(null);

            try {
                const result = await fetchProducts({
                    category,
                    search: searchQuery,
                    filters: apiFilters,
                    sort: sortBy,
                    page: currentPage,
                    limit: 12
                });

                if (cancelled) return;
                setBackendProducts(result.data);
                setPagination(result.pagination);
            } catch (err) {
                if (cancelled) return;
                setError(err.message);
                setBackendProducts([]);
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        loadProducts();

        return () => {
            cancelled = true;
        }
    }, [category, searchQuery, apiFilters, sortBy, currentPage]);


    const handleSearchQueryChange = (newValue) => {
        setSearchQuery(newValue);
        setCurrentPage(1);
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
                        current: filterOption.value,
                        active: true
                    }
                }
            });
        }

        setCurrentPage(1);
    }

    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        setCurrentPage(1);
    }

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
                    
                    {
                        error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )
                    }

                    {
                        isLoading ? (
                            <div className="text-center py-5">
                                Loading products...
                            </div>
                        ) : (
                            <ProductDisplay 
                                key={category} 
                                title={title} 
                                productCards={backendProducts}
                                sortBy={sortBy}
                                onSortChange={ handleSortChange } 
                                currentPage={pagination.page}
                                totalPages={pagination.totalPages}
                                totalItems={pagination.totalItems}
                                pageSize={pagination.limit}
                                onPageChange={setCurrentPage}/>
                        )
                    }

                </main>
            </Row>
        </Container>
        </>
    )
}

export default ShopPage;