import React from "react";
import ReactDOM from "react-dom/client";
import "./app/layout/styles.css";
// import { createBrowserHistory } from "history";
// import CustomRouter from "./app/router/CustomRouter";
// import { CtxProvider } from "./app/ctx/StoreCtx";
import { Provider } from "react-redux";
import { store } from "./app/store/configureStore";
// import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
// Import css files for the carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { RouterProvider } from "react-router-dom";
import router from "./app/router/Router";

// export const history = createBrowserHistory();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        {/* <CustomRouter history={history}> -> used to use the old history style after installing history from npm*/}
        {/* no context used anymore => replaced by Redux */}
        {/* <CtxProvider> */}
        <Provider store={store}>
            <RouterProvider router={router} />
            {/* <App /> */}
        </Provider>
        {/* </CtxProvider> */}
        {/* </CustomRouter> */}
    </React.StrictMode>
);
