// pages/_app.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as ga from '../services/ga';
import '../styles/global.css';

const App = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    // If GA_TRACKING_ID is not set, return early.
    if (!ga.GA_TRACKING_ID) return;

    const handleRouteChange = (url) => {
      ga.pageview(url);
    };

    // When the component is mounted, subscribe to router changes
    // and log those page views
    router.events.on('routeChangeComplete', handleRouteChange);

    // Hide the #grnhse_app iframe on page load
    const grnhseApp = document.getElementById('grnhse_app');
    if (grnhseApp) {
      grnhseApp.style.display = 'none';
    }

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
};

export default App;