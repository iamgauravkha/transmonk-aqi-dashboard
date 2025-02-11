import { Route, Routes } from "react-router-dom";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* <Route path="/:id" element={<Dashboard />} /> */}
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
};

export default App;
