// pages/api/flushCache.js
import { cache } from '../../services/greenhouseApi';
import { cache as apiCache } from './greenhouseJobs';
import Cors from 'cors';

const cors = Cors({
  methods: ['POST', 'OPTIONS'],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === 'POST') {
    try {
      // Clear the cache in greenhouseApi.js
      cache.jobs = null;
      cache.jobsTimestamp = null;
      cache.departments = null;
      cache.departmentsTimestamp = null;
      cache.locations = null;
      cache.locationsTimestamp = null;

      // Clear the cache in greenhouseJobs.js
      apiCache.del('greenhouse-jobs');

      res.status(200).json({ message: 'Cache flushed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}