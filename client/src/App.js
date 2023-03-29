import { BrowserRouter, Routes, Route } from "react-router-dom";
import Album from "./Pages/Album";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import { Header } from "./comp/Header";


function App() {
  return (

    <BrowserRouter>
      <Header> </Header>
        <Routes>
          <Route path="/" element={<Album />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App;
