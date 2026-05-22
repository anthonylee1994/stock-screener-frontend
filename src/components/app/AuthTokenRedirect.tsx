import React from "react";
import {Navigate} from "react-router";

interface RouteState {
    returnPath?: string;
}

interface Props {
    authToken: string;
    loginPath: string;
    redirectPath: string;
    onAuthenticate(apiToken: string, signal: AbortSignal): Promise<boolean>;
}

export const AuthTokenRedirect = React.memo<Props>(({authToken, loginPath, redirectPath, onAuthenticate}) => {
    const [nextPath, setNextPath] = React.useState<string | null>(null);

    React.useEffect(() => {
        const abortController = new AbortController();

        void onAuthenticate(authToken, abortController.signal).then(isAuthenticated => {
            if (!abortController.signal.aborted) {
                setNextPath(isAuthenticated ? redirectPath : loginPath);
            }
        });

        return () => {
            abortController.abort();
        };
    }, [authToken, loginPath, onAuthenticate, redirectPath]);

    if (!nextPath) {
        return null;
    }

    return <Navigate replace state={nextPath === loginPath ? ({returnPath: redirectPath} satisfies RouteState) : undefined} to={nextPath} />;
});
