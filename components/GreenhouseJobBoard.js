// components/GreenhouseJobBoard.js
import React, { useEffect, useRef } from 'react';

const GreenhouseJobBoard = ({ jobId }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    iframe.style.display = 'none';
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (jobId) {
      iframe.src = `https://boards.greenhouse.io/embed/job_board?for=day1academies&gh_jid=${jobId}`;
      iframe.style.display = 'block';
    } else {
      iframe.style.display = 'none';
    }
  }, [jobId]);

  return (
    <div id="grnhse_app">
      <iframe
        id="grnhse_iframe"
        ref={iframeRef}
        width="100%"
        height="2115"
        frameBorder="0"
        scrolling="no"
        allow="geolocation"
        onLoad={() => window.scrollTo(0, 0)}
        title="Greenhouse Job Board"
      ></iframe>
    </div>
  );
};

export default GreenhouseJobBoard;