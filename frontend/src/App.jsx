import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/user/Home";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
