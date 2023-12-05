// services/greenhouseApi.js

const BASE_URL = 'https://boards-api.greenhouse.io/v1/boards/day1academies/jobs';

/**
 * Fetches a list of jobs from the Greenhouse API.
 * @param {boolean} includeContent - Whether to include full post descriptions, departments, and offices.
 */
export const fetchJobs = async (includeContent = false) => {
  try {
    const url = includeContent ? `${BASE_URL}?content=true` : BASE_URL;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const jobsData = await response.json();
    return jobsData.jobs;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
};

/**
 * Fetches details for a specific job by ID from the Greenhouse API.
 * @param {string} jobId - The ID of the job to fetch details for.
 * @param {boolean} includeContent - Whether to include full post descriptions, departments, and offices.
 */
export const fetchJobDetails = async (jobId, includeContent = false) => {
  try {
    const url = includeContent ? `${BASE_URL}/${jobId}?content=true` : `${BASE_URL}/${jobId}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const jobDetails = await response.json();
    return jobDetails;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
};
