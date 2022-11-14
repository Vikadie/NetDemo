import React, { ReactNode } from "react";
import { Router } from "react-router-dom";

const CustomRouter = ({
    basename,
    children,
    history,
}: {
    basename?: any;
    children: ReactNode;
    history: any;
}) => {
    const [state, setState] = React.useState({
        action: history.action,
        location: history.location,
    });

    React.useLayoutEffect(() => history.listen(setState), [history]);

    return (
        <Router
            basename={basename}
            children={children}
            location={state.location}
            navigationType={state.action}
            navigator={history}
        />
    );
};

export default CustomRouter;
