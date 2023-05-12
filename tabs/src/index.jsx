import React from 'react';
import ReactDOM from 'react-dom';
import 'fontsource-roboto';
import { Provider } from 'react-redux';
import { BrowserRouter, HashRouter, Route } from 'react-router-dom';
import { TouchBackend } from 'react-dnd-touch-backend';
import { DndProvider } from 'react-dnd';
import { PersistGate } from 'redux-persist/es/integration/react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import App from './components/App';
import { isCordova, onCordovaReady, initCordovaPlugins } from './cordova-util';
import './index.css';
import './polyfills';
import './env';
import LanguageProvider from './providers/LanguageProvider';
import SpeechProvider from './providers/SpeechProvider';
import ThemeProvider from './providers/ThemeProvider';
import configureStore, { getStore } from './store';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import SubscriptionProvider from './providers/SubscriptionProvider';
import { NODE_ENV, AZURE_INST_KEY, PAYPAL_CLIENT_ID } from './constants';

if (AZURE_INST_KEY) {
  const appInsights = new ApplicationInsights({
    config: {
      disableTelemetry: NODE_ENV === 'development',
      instrumentationKey: AZURE_INST_KEY,
      enableAutoRouteTracking: true,
      loggingLevelTelemetry: 2,
      enableCorsCorrelation: true,
      enableRequestHeaderTracking: true,
      enableResponseHeaderTracking: true,
      correlationHeaderExcludedDomains: [
        '*.google-analytics.com',
        'globalsymbols.com',
        '*.arasaac.org',
        'mulberrysymbols.org',
        'madaportal.org',
        '*.doubleclick.net',
        'pagead2.googlesyndication.com',
        'eastus.tts.speech.microsoft.com'
      ]
    }
  });
  appInsights.loadAppInsights();
  appInsights.trackPageView(); // Manually call trackPageView to establish the current user/session/pageview
}
const { persistor } = configureStore();
const store = getStore();
const dndOptions = {
  enableTouchEvents: true,
  enableMouseEvents: true,
  enableKeyboardEvents: true
};

// When running in Cordova, must use the HashRouter
const PlatformRouter =  HashRouter;

// PayPal configuration
const paypalOptions = {
  'client-id': PAYPAL_CLIENT_ID,
  currency: 'USD',
  vault: true,
  intent: 'subscription'
};

const renderApp = () => {
  if (isCordova()) {
    initCordovaPlugins();
  }
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <PayPalScriptProvider options={paypalOptions}>
          <SpeechProvider>
            <LanguageProvider>
              <ThemeProvider>
                <SubscriptionProvider>
                  <PlatformRouter>
                    <DndProvider backend={TouchBackend} options={dndOptions}>
                      <Route path="/" component={App} />
                    </DndProvider>
                  </PlatformRouter>
                </SubscriptionProvider>
              </ThemeProvider>
            </LanguageProvider>
          </SpeechProvider>
        </PayPalScriptProvider>
      </PersistGate>
    </Provider>,
    document.getElementById('root')
  );
};

isCordova() ? onCordovaReady(renderApp) : renderApp();
