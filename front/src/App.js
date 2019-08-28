import React from "react";
import "./App.css";
import SendEvent from "./components/SendEvent";
import Events from "./components/Events";
import EditEvent from "./components/EditEvent";

function App() {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "row",
        alignItems: "stretch"
      }}
      className="App"
    >
      <div>
        <Events />
      </div>
      <div>
        <SendEvent style={{ float: "right" }} />
      </div>
      <div>
        <EditEvent />
      </div>
    </div>
  );
}

export default App;
