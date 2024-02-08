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
 * Fetches active locations and separates the state and city for dropdown usage.
 */
export const fetchActiveLocationsForDropdown = async () => {
  const url = 'https://boards-api.greenhouse.io/v1/boards/day1academies/offices?render_as=list';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch offices data');
    }
    const { offices } = await response.json();

    const stateCityMap = offices.reduce((acc, office) => {
      const { id, location } = office;
      if (location && location !== 'Remote') {
        let [_, state, city] = location.split(', ').reverse(); // Assuming format "City, State, Country"
        
        // Skip adding "Unknown" cities or states
        if (city === 'Unknown' || state === 'Unknown') return acc;

        city = city || 'Unknown'; // Fallback for cases where city is not parsed correctly, now redundant due to above check
        state = state || 'Unknown'; // Fallback for cases where state is not parsed correctly, now redundant due to above check

        if (!acc[state]) acc[state] = [];
        if (!acc[state].find(item => item.name === city.trim())) acc[state].push({ name: city.trim(), id });
      } else if (location === 'Remote') {
        // Handle 'Remote' as a special case, assigning it directly
        const state = 'Remote';
        if (!acc[state]) acc[state] = [];
        acc[state].push({ name: 'Remote', id: 'Remote' });
      }
      return acc;
    }, {});

    const formattedData = Object.keys(stateCityMap).map(state => ({
      label: state,
      options: stateCityMap[state].map(({ name, id }) => ({ value: id.toString(), label: name }))
    }));

    // Filter out any "Unknown" labels before returning
    return formattedData.filter(({ label }) => label !== 'Unknown');
  } catch (error) {
    console.error('There was an error fetching the office locations:', error);
    throw error;
  }
};





export const getDepartments = () => {
  return fetch(`${BASE_URL}/departments`, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => res.json())
    .then(data => data.map(dept => ({ value: dept.id, label: dept.name })));
};