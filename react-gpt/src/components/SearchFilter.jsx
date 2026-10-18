import { InputGroup, Form } from "react-bootstrap";

function SearchFilter({ title, onSearch}) {

    const handleSearch = (event) => {
        onSearch(event.target.value);
    }

    return (
        <InputGroup
            className="mb-4 shadow">
            <Form.Control
                type="search"
                placeholder={`Search ${title.toLowerCase()}...`}
                aria-label={`Search ${title}`}
                onChange={ handleSearch } />
        </InputGroup>
    )
}

export default SearchFilter;