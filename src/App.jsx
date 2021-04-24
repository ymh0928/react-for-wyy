import "./App.css";
import { Fragment } from "react";
import Store from "./store/Store";
import Home from "./pages/home/Home";

function App() {
  return (
    <Fragment>
      <Store>
        <Home />
      </Store>
    </Fragment>
  );
}

export default App;
