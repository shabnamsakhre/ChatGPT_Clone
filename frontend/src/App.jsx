import { ToastContainer } from "react-toastify";
import MainRoute from "./routes/MainRoute";

const App = () => {
  return (
    <div>
      <MainRoute />
      <ToastContainer />
    </div>
  );
};

export default App;
