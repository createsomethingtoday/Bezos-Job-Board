// pages/api/greenhouseJobs.js

async function fetchHarvestJobDetails(jobId, token) {
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

  return response.json();
}

export default async function handler(req, res) {
  try {
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

    res.status(200).json(jobsWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal server error',
      details: error.message
    });
  }
}
