declare global {
    interface Window {
        _env_: {
            BACKEND_URL: string;
            APPLICATIONINSIGHTS_CONNECTION_STRING: string;
            APP_NAME: string;
        };
    }
}