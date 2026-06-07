const { useAzureMonitor } = require("@azure/monitor-opentelemetry");
const { registerInstrumentations } = require ( "@opentelemetry/instrumentation"); 
const { ExpressInstrumentation } = require ( "@opentelemetry/instrumentation-express");
const { createAzureSdkInstrumentation } = require ( "@azure/opentelemetry-instrumentation-azure-sdk"); 
const { Resource } = require ( "@opentelemetry/resources"); 
const { ATTR_SERVICE_NAME } = require ( "@opentelemetry/semantic-conventions"); 
const { trace, metrics } = require ( "@opentelemetry/api"); 
const dotenv = require ( 'dotenv'); 
dotenv.config();

function initializeAppInsights() {
    const connectionString = process.env.APPINSIGHTS_CONNECTION_STRING?.trim();

    if (!connectionString) {
        console.info('Application Insights disabled: APPINSIGHTS_CONNECTION_STRING is not set.');
        return;
    }

    const resource = new Resource({
            [ATTR_SERVICE_NAME]: process.env.SERVICE_NAME || 'default-service-name',
        });

    const options = {
        azureMonitorExporterOptions: {
            connectionString
        },
        instrumentationOptions: {
            http: { enabled: true },
            express: { enabled: true }
        },
        samplingRatio: 1.0, // 100% sampling
        resource: resource,
        enableLiveMetrics: true,
        enableStandardMetrics: true
    };

    useAzureMonitor(options);
    registerInstrumentations({
        instrumentations: [
            new ExpressInstrumentation(),
            createAzureSdkInstrumentation()
        ],
        tracerProvider: trace.getTracerProvider(),
        meterProvider: metrics.getMeterProvider(),
        
      });
}

// Funzione per ottenere il tracer
function getTracer() {
    const serviceName = process.env.SERVICE_NAME || 'default-service-name';
    return trace.getTracer(`${serviceName}-tracer`);
}


module.exports =  {initializeAppInsights, getTracer };