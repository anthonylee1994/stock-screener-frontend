import React from "react";
import * as ReactDOMClient from "react-dom/client";
import {BrowserRouter} from "react-router";
import {App} from "./app";
import "./Index.css";

ReactDOMClient.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
