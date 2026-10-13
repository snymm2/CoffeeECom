import Counter from "./Counter"
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import ProfileCard from "./ProfileCard";
import ProfileCard2 from "./ProfileCard2";

function App() {
  return (
    <>
      <Container className="d-flex flex-row min-vh-100 align-items-center justify-content-center gap-3">
        <ProfileCard 
          name={"Sanyam Maharjan"}
          occupation={"Developer"}
          location={"Somewhere on Earth"}
          description={"Living Life in Different Eras."}
          imageUrl={"/CuteCatPP.jpg"}>
        </ProfileCard>
        <ProfileCard2
          name={"Sanyam Maharjan"}
          occupation={"Developer"}
          location={"Somewhere on Earth"}
          description={"Living Life in Different Eras."}
          imageUrl={"/CuteCatPP.jpg"}>
        </ProfileCard2>
        <ProfileCard
          name={"Hello World"}
          occupation={"Nobody"}
          location={"Void"}
          description={"Who Am I?"}>
        </ProfileCard>
      </Container>
    </>
  )
}

export default App
