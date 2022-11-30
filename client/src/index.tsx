import React from "react";
import ReactDOM from "react-dom/client";
import "./app/layout/styles.css";
import App from "./app/layout/App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserHistory } from "history";
import CustomRouter from "./app/Router/CustomRouter";
// import { CtxProvider } from "./app/ctx/StoreCtx";
import { Provider } from "react-redux";
import { store } from "./app/store/configureStore";
// import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
// Import css files for the carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const history = createBrowserHistory();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <CustomRouter history={history}>
            {/* no context used anymore => replaced by Redux */}
            {/* <CtxProvider> */}
            <Provider store={store}>
                <App />
            </Provider>
            {/* </CtxProvider> */}
        </CustomRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
