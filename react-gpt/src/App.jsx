import Counter from "./Counter"
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

function App() {
  return (
    <>
      <Container className="d-flex flex-column min-vh-100 align-items-center justify-content-center gap-3">
        <Counter step={5}>
        </Counter>
      </Container>
    </>
  )
}

export default App
