import { Analytics } from "@analytics/google-analytics";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <> 
      <Analytics
        measurementId="G-L8LHB2BRX4"
        debug
        trackPageViews
        trackURLs
      />

      <Component {...pageProps} />
    </>
  );
}