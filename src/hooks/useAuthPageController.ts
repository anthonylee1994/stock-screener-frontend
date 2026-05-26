import React from "react";
import {useLocation, useNavigate} from "react-router";
import {useAuthStore} from "@/stores/useAuthStore";

interface LocationState {
    returnPath?: string;
}

export function useAuthPageController() {
    const apiToken = useAuthStore(state => state.apiToken);
    const authError = useAuthStore(state => state.authError);
    const isAuthenticating = useAuthStore(state => state.isAuthenticating);
    const login = useAuthStore(state => state.login);
    const setTokenInput = useAuthStore(state => state.setTokenInput);
    const tokenInput = useAuthStore(state => state.tokenInput);
    const location = useLocation();
    const navigate = useNavigate();
    const abortControllerRef = React.useRef<AbortController | null>(null);
    const locationState = location.state as LocationState | null;
    const returnPath = locationState?.returnPath ?? "/";

    React.useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    React.useEffect(() => {
        if (apiToken.length > 0) {
            navigate(returnPath, {replace: true});
        }
    }, [apiToken, returnPath, navigate]);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        abortControllerRef.current?.abort();

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        void login(abortController.signal);
    }

    function handleTokenInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
        setTokenInput(event.target.value);
    }

    return {
        authError,
        isAuthenticating,
        tokenInput,
        handleSubmit,
        handleTokenInputChange,
    };
}
