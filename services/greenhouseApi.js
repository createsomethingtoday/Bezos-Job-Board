// services/greenhouseApi.js

const BASE_URL = 'https://boards-api.greenhouse.io/v1/boards/day1academies';

/**
 * Fetches a list of jobs from the Greenhouse API.
 * @param {boolean} includeContent - Whether to include full post descriptions, departments, and offices.
 */
export const fetchJobs = async (includeContent = false) => {
  try {
    const url = includeContent ? `${BASE_URL}/jobs?content=true` : BASE_URL;
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
    const url = includeContent ? `${BASE_URL}/jobs/${jobId}?content=true` : `${BASE_URL}/${jobId}`;
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

/**
 * Fetches a list of departments from the Greenhouse API.
 */
export const fetchDepartments = async () => {
  try {
    const response = await fetch(`${BASE_URL}/departments?render_as=list`);
    if (!response.ok) {
      console.error('Error response:', response);
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const departmentsData = await response.json();
    return departmentsData.departments;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
};


/**
 * Fetches a list of offices (locations) from the Greenhouse API.
 */
export const fetchOffices = async () => {
  try {
    const response = await fetch(`${BASE_URL}/offices?render_as=list`);
    if (!response.ok) {
      console.error('Error response:', response);
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }
    const officesData = await response.json();
    return officesData.offices;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
};