// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import AppRoutes from "./routes.tsx"; // Import your routes

import "./App.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes /> 
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);