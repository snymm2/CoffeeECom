import Container from "react-bootstrap/Container";

import ProductCard from "./ProductCard";
import products from "./coffeeProducts";
import ProductDisplay from "./ProductDisplay";
import { Navbar, Nav, Form, InputGroup, Row, Card } from "react-bootstrap";

function App() {
  return (
    <>
      <Navbar
        expand="lg">
          <Container>
            <Navbar.Brand>Code-n-Coffee</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav>
                <Nav.Link>Coffee</Nav.Link>
                <Nav.Link>Equipment</Nav.Link>
                <Nav.Link>Apparel</Nav.Link>
              </Nav>
            </Navbar.Collapse>
            <Form inline>
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
      <Container>
        <Row>
          <aside
            className="col-12 col-md-4 col-lg-3">
              <Card className="p-3 shadow-sm mb-4">
                <Card.Title className="mb-3">Categories</Card.Title>
                <Form.Check 
                  type="checkbox"
                  label="Category 1"/>
                <Form.Check
                  type="checkbox"
                  label="Category 2" />
                <Form.Check
                  type="checkbox"
                  label="Category 3" />
              </Card>

              <Card className="p-3 shadow-sm mb-4">
                <Card.Title className="mb-3">Brands</Card.Title>
                <Form.Check
                  type="checkbox"
                  label="Brand 1" />
                <Form.Check
                  type="checkbox"
                  label="Brand 2" />
                <Form.Check
                  type="checkbox"
                  label="Brand 3" />
              </Card>

              <Card className="p-3 shadow-sm mb-4">
                <Card.Title className="mb-3">Price Range</Card.Title>
                <Form.Range
                  type="checkbox"
                  label="Brand 1" />
              </Card>
              
          </aside>
          <main
            className="col-12 col-md-8 col-lg-9">
            <ProductDisplay productCards={products.slice(0, 6)}></ProductDisplay>
          </main>
        </Row>
      </Container>
    </>
  )
}

export default App
