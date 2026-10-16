import { Navbar, Nav, Form, InputGroup, Container } from "react-bootstrap";
import { Link } from "react-router";

function NavbarMain() {
    return (
        <Navbar
            expand="lg">
            <Container>
                <Navbar.Brand>Code-n-Coffee</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        <Nav.Link as={Link} to="/coffee">Coffee</Nav.Link>
                        <Nav.Link as={Link} to="/equipment">Equipment</Nav.Link>
                        <Nav.Link as={Link} to="/merch">Merch</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                <Form>
                    <InputGroup>
                        <InputGroup.Text>🔍</InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Search...">
                        </Form.Control>
                    </InputGroup>
                </Form>
            </Container>
        </Navbar>
    )
}

export default NavbarMain;