// services/ga.js
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Log the pageview with their URL
export const pageview = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// Log specific events happening.
export const event = ({ action, params }) => {
  window.gtag('event', action, params);
};
