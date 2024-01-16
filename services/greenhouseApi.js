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
    
    // Add logging to inspect the response
    console.log('Jobs data:', jobsData);

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
export const fetchActiveDepartmentsList = async () => {
  try {
    const response = await fetch(`${BASE_URL}/departments?render_as=list`);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const departmentsData = await response.json();

    // Filter departments that have active jobs
    const activeDepartments = departmentsData.departments.filter(department =>
      department.jobs && department.jobs.length > 0
    );

    return activeDepartments;

  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
};



/**
 * Fetches a list of offices (locations) with active job openings from the Greenhouse API.
 */
export const fetchActiveOfficesList = async () => {
  try {
    const response = await fetch(`${BASE_URL}/offices?render_as=list`);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const officesData = await response.json();

    // Filter offices that have active jobs in any of their departments
    const activeOffices = officesData.offices.filter(office =>
      office.departments.some(department => department.jobs && department.jobs.length > 0)
    );

    return activeOffices;

  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
};


