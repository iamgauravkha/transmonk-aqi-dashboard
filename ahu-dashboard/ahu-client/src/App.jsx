import { Route, Routes } from "react-router-dom";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import Model from "./components/Model";

const App = () => {
  return (
    <>
      <Routes>
        {/* <Route path="/" element={<Dashboard />} /> */}
        <Route path="/:id" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route
          path="/modal"
          element={<Model modelPath="/fan_3d_model.glb" />}
        />
      </Routes>
    </>
  );
};

export default App;
