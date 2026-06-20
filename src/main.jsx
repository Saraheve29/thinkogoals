import React from "react";
import ReactDOM from "react-dom/client";
import ThinkoGoalsApp from "./thinkogoals.jsx";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThinkoGoalsApp />
  </React.StrictMode>
);
