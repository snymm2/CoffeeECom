import { useEffect, useState, useMemo } from "react";

import { Container, Row } from "react-bootstrap";

import ProductsFilter from "../components/ProductsFilter";
import ProductDisplay from "../components/ProductDisplay";

import filters from "../data/filters";

import { fetchProducts, fetchProductFilterOptions } from '../services/productService';

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
    
function ShopPage({ title, category}) {

    const [serverFilterData, setServerFilterData] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function loadFilterOptions() {
            setFilterOptionsLoading(true);
            setFilterOptionsError(null);
            setServerFilterData(null);

            try {
                const result = await fetchProductFilterOptions(category);

                if (!cancelled) {
                    setServerFilterData(result);
                }
            } catch (err) {
                if (!cancelled) {
                    setFilterOptionsError(err.message);
                }
            } finally {
                if (!cancelled) {
                    setFilterOptionsLoading(false);
                }
            }
        }

        loadFilterOptions();

        return () => {
            cancelled = true;
        }
    }, [category]);

    const actualFilters = useMemo(() => {
        const definitions = filters[category] ?? [];

        return definitions.map(filter => {
            if (filter.filterType === "Checkbox") {
                return {
                    ...filter,
                    filterSubcategories: serverFilterData?.options?.[filter.filterName] ?? []
                };
            }

            if (filter.filterType === "Range") {

                const range = serverFilterData?.ranges?.[filter.filterName];

                return {
                    ...filter,
                    filterMin: range?.min ?? 0,
                    filterMax: range?.max ?? 0
                };
            }
        })
    }, [category, serverFilterData]);

    useEffect(() => {
        if (!serverFilterData) return;

        setFilterOptions(createInitialFilterOptions(actualFilters));
        setCurrentPage(1);
    }, [category, serverFilterData, actualFilters]);

    const [filterOptions, setFilterOptions] = useState(() => createInitialFilterOptions(actualFilters));
    const [filterOptionsLoading, setFilterOptionsLoading] = useState(false);
    const [filterOptionsError, setFilterOptionsError] = useState(null);

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
        <Container
            className="py-4"
            fluid
            style={{backgroundColor: "#F5F0E6"}}>
            <Row>
                <aside
                    className="col-12 col-md-4 col-lg-3">

                    {
                        filterOptionsError && (
                            <div className="alert alert-danger" role="alert">
                                {filterOptionsError}
                            </div>
                        )
                    }

                    {
                        filterOptionsLoading ? (
                            <div className="text-center py-5">
                                Loading products...
                            </div>
                        ) : (
                            <ProductsFilter 
                                title={title}
                                key={category}
                                filterData={ actualFilters }
                                filterOptions={filterOptions}
                                onFilter={ handleFilterOptionsChange }
                                onSearch={ handleSearchQueryChange }/>
                        )
                    }
                    
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