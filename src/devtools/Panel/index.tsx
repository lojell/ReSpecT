import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import "./index.scss";
import { ContextProvider } from "../../store";

chrome.tabs.query({ active: true }, ([tab]) => {
  
  ReactDOM.render(
    <ContextProvider>
      <App tab={tab} />
    </ContextProvider>,
    document.getElementById("root")
  );
});

export default App;
