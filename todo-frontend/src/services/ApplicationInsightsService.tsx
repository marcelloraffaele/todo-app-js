import {ApplicationInsights, ITelemetryItem} from '@microsoft/applicationinsights-web';
import {ReactPlugin} from '@microsoft/applicationinsights-react-js';
import './Window';
import { createBrowserHistory } from "history";

const browserHistory = createBrowserHistory();

const reactPlugin = new ReactPlugin();
const appInsightsConnString = window._env_?.APPLICATIONINSIGHTS_CONNECTION_STRING?.trim()
  || import.meta.env.VITE_APPLICATIONINSIGHTS_CONNECTION_STRING?.trim()
  || '';
const appName = window._env_?.APP_NAME || import.meta.env.VITE_APP_NAME || 'todo-app-frontend';

const appInsights = appInsightsConnString
  ? new ApplicationInsights({
      config: {
        connectionString: appInsightsConnString,
        extensions: [reactPlugin],
        enableAutoRouteTracking: true,
        disableAjaxTracking: false,
        autoTrackPageVisitTime: true,
        enableCorsCorrelation: true,
        enableRequestHeaderTracking: true,
        enableResponseHeaderTracking: true,

        extensionConfig: {
          [reactPlugin.identifier]: { history: browserHistory }
        },
        distributedTracingMode: 1,
      }
    })
  : null;

if (appInsights) {
  appInsights.loadAppInsights();

  appInsights.addTelemetryInitializer((env: ITelemetryItem) => {
    env.tags = env.tags || {};
    env.tags["ai.cloud.role"] = appName;
    env.data = env.data || {};
    env.data["ms-appName"] = appName;
    env.data["ms-user"] = 'demo-user';
    env.data["ms-userid"] = 'demo-user-id';
  });
}

export { reactPlugin, appInsights };