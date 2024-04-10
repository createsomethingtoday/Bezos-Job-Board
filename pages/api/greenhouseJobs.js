// pages/api/greenhouseJobs.js
import NodeCache from 'node-cache';
export const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour (3600 seconds)

async function fetchHarvestJobDetails(jobId, token) {
  const cacheKey = `job-details-${jobId}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  const url = `https://harvest.greenhouse.io/v1/jobs/${jobId}`;
  const authValue = `Basic ${token}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: authValue
    }
  });
  if (!response.ok) {
    throw new Error(`Harvest API error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  cache.set(cacheKey, data);
  return data;
}

export default async function handler(req, res) {
  try {
    const cacheKey = 'greenhouse-jobs';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      // Set caching headers in the response with the no-cache directive
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('ETag', `"${cachedData.timestamp}"`);

      // Check if the request has the If-None-Match header
      const ifNoneMatch = req.headers['if-none-match'];
      if (ifNoneMatch === `"${cachedData.timestamp}"`) {
        res.status(304).end();
        return;
      }

      res.status(200).json(cachedData.data);
      return;
    }

    const boardResponse = await fetch(`https://boards-api.greenhouse.io/v1/boards/day1academies/jobs?content=true`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const boardData = await boardResponse.json();
    const token = process.env.GREENHOUSE_HARVEST_API_KEY;
    const jobsWithDetails = await Promise.all(boardData.jobs.map(async (job) => {
      const jobDetails = await fetchHarvestJobDetails(job.internal_job_id, token);
      return { ...job, ...jobDetails };
    }));

    const timestamp = Date.now();
    cache.set(cacheKey, { data: jobsWithDetails, timestamp });

    // Set caching headers in the response with the no-cache directive
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('ETag', `"${timestamp}"`);

    res.status(200).json(jobsWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal server error',
      details: error.message
    });
  }
}