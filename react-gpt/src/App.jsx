import Counter from "./Counter"
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

function App() {
  return (
    <>
      <Container className="d-flex min-vh-100 flex-column justify-content-center">
        <Row className="justify-content-center align-items-center">
          <Counter></Counter>
        </Row>
      </Container>
    </>
  )
}

export default App
