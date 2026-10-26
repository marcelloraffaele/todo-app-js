jest.mock('@azure/monitor-opentelemetry', () => ({ useAzureMonitor: jest.fn() }));
jest.mock('@opentelemetry/instrumentation', () => ({ registerInstrumentations: jest.fn() }));
jest.mock('@opentelemetry/instrumentation-express', () => ({ ExpressInstrumentation: jest.fn() }));
jest.mock('@azure/opentelemetry-instrumentation-azure-sdk', () => ({
    createAzureSdkInstrumentation: jest.fn(() => ({}))
}));

const { useAzureMonitor } = require('@azure/monitor-opentelemetry');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { initializeAppInsights } = require('./app-insights');

describe('Application Insights upgrade compatibility', () => {
    it('constructs an OpenTelemetry 2 resource when telemetry is configured', () => {
        const original = process.env.APPINSIGHTS_CONNECTION_STRING;
        process.env.APPINSIGHTS_CONNECTION_STRING = 'InstrumentationKey=test';
        try {
            initializeAppInsights();
            expect(useAzureMonitor).toHaveBeenCalledWith(expect.objectContaining({
                resource: expect.objectContaining({
                    attributes: expect.objectContaining({ 'service.name': expect.any(String) })
                })
            }));
            expect(registerInstrumentations).toHaveBeenCalled();
        } finally {
            if (original === undefined) {
                delete process.env.APPINSIGHTS_CONNECTION_STRING;
            } else {
                process.env.APPINSIGHTS_CONNECTION_STRING = original;
            }
        }
    });
});
