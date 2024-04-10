import { fetchJobs } from '../../services/greenhouseApi';

const CACHE_EXPIRATION = 60 * 60; // Cache for 1 hour (in seconds)

let cachedJobs = null;
let cacheTimestamp = null;

export default async function handler(req, res) {
  if (cachedJobs && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_EXPIRATION * 1000) {
    // Serve cached data if available and not expired
    res.status(200).json(cachedJobs);
  } else {
    try {
      // Fetch fresh data from the API
      const jobs = await fetchJobs(true);
      cachedJobs = jobs;
      cacheTimestamp = Date.now();
      res.status(200).json(jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}