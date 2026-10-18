import { useEffect, useState } from "react";

import { Card, Form, InputGroup } from "react-bootstrap";

import SliderFilter from "./SliderFilter";
import CheckboxFilter from "./CheckboxFilter";
import SearchFilter from "./SearchFilter";

function ProductsFilter({ title, filterData, filterOptions, onFilter, onSearch }) {

    return (
        <>
        <SearchFilter title={title} onSearch={onSearch}/>

        {
            filterData.map((filter) => {
                if (filter.filterType === "Checkbox") {
                    return (
                        <CheckboxFilter
                            key={filter.filterName}
                            selectedValues = {filterOptions[filter.filterName].targets}
                            filter={filter}
                            onCheck={ onFilter } />
                    )
                }

                if (filter.filterType === "Range") {
                    return (
                    <SliderFilter
                        key={`${title}-${filter.filterName}`}
                        selectedValue={filterOptions[filter.filterName].current}
                        filter={filter}
                        onFilter={onFilter}
                    />
                    )

                }
            })
        }
        </>
    )
}

export default ProductsFilter;