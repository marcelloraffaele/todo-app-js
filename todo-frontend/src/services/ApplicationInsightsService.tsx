import {ApplicationInsights, ITelemetryItem} from '@microsoft/applicationinsights-web';
import {ReactPlugin} from '@microsoft/applicationinsights-react-js';

const reactPlugin = new ReactPlugin();
const appInsights = new ApplicationInsights({
  config: {
    connectionString: "InstrumentationKey=5775a8fe-2c9c-424c-9fb0-9163bafd9ba1;IngestionEndpoint=https://italynorth-0.in.applicationinsights.azure.com/;LiveEndpoint=https://italynorth.livediagnostics.monitor.azure.com/;ApplicationId=a08dfd8b-e02c-459a-86a6-d23d56c17176",
    extensions: [reactPlugin],
    enableAutoRouteTracking: true,
    disableAjaxTracking: false,
    autoTrackPageVisitTime: true,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
  }
});
appInsights.loadAppInsights();

appInsights.addTelemetryInitializer((env:ITelemetryItem) => {
    env.tags = env.tags || {};
    env.tags["ai.cloud.role"] = "todo-app-frontend";
    //custom props
    env.data = env.data || {};
    env.data["ms-appName"] = "todo-app-frontend";
    env.data["ms-user"] = "demo-user";
    env.data["ms-userid"] = "demo-user-id";
});

export { reactPlugin, appInsights };