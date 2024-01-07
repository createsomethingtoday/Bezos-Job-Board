// pages/api/jobs.js

import Cors from 'cors';

const cors = Cors({
  methods: ['GET', 'HEAD']
});

export default async function handler(req, res) {

  cors(req, res, async () => {

    try {
    
      console.log('GREENHOUSE API KEY:', process.env.GREENHOUSE_HARVEST_API_KEY);

      const url = 'https://harvest.greenhouse.io/v1/job_posts';
      
      const token = process.env.GREENHOUSE_HARVEST_API_KEY;

      // Try without base64 encoding
      const authValue = `Basic ${token}`; 

      console.log('Auth Header:', authValue);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: authValue  
        }
      });
  
      if(!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
  
      res.status(200).json(data);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: 'Internal server error',
        details: error.message
      });

    }

  });

}