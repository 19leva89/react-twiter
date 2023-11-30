import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import "./normalize.css";
import "./main.css";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
	<StrictMode>
		<App />
	</StrictMode>
);
