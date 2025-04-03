// Import the useAzureMonitor function and the AzureMonitorOpenTelemetryOptions class from the @azure/monitor-opentelemetry package.
import { useAzureMonitor, AzureMonitorOpenTelemetryOptions } from '@azure/monitor-opentelemetry';

export function initializeTelemetry() {

    // Create a new AzureMonitorOpenTelemetryOptions object.
    const appInsightsConnectionString = process.env.APPINSIGHTS_CONNECTION_STRING;
    const options: AzureMonitorOpenTelemetryOptions = {
        azureMonitorExporterOptions: {
            connectionString: "InstrumentationKey=5775a8fe-2c9c-424c-9fb0-9163bafd9ba1;IngestionEndpoint=https://italynorth-0.in.applicationinsights.azure.com/;LiveEndpoint=https://italynorth.livediagnostics.monitor.azure.com/;ApplicationId=a08dfd8b-e02c-459a-86a6-d23d56c17176",
        }
    };
    // Enable Azure Monitor integration using the useAzureMonitor function and the AzureMonitorOpenTelemetryOptions object.
    useAzureMonitor(options);

    console.log('Azure Monitor integration enabled.');
}