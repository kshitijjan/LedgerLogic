import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { TransactionsProvider } from "./context/TransactionContext";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <TransactionsProvider>
      <App />
    </TransactionsProvider>
  </React.StrictMode>
);