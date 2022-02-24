import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Nav } from "./components/Nav";
import { Home } from "./pages/Home";
import { FrameComponentDemo } from "./pages/Frame-Component-Demo";
import { NotFound } from "./pages/NotFound";

import "./App.css";

const OtherPage = () => {
  // temp page for routing tests
  return <div>other page</div>;
};

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Nav />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/frame-component-demo"
              element={<FrameComponentDemo />}
            />
            <Route path="/other-page" element={<OtherPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
