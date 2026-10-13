import Container from "react-bootstrap/Container";
import ModeSwitcher from "./ModeSwitcher";

function App() {
  return (
    <>
      <Container className="d-flex w-50 h-100 align-items-center justify-content-center">
        <ModeSwitcher />
      </Container>
    </>
  )
}

export default App
