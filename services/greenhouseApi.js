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
 * Fetches a list of departments from the Greenhouse API and excludes "No Department".
 */
export const fetchActiveDepartmentsList = async () => {
  try {
    const response = await fetch(`${BASE_URL}/departments?render_as=list`);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const departmentsData = await response.json();

    // Filter out "No Department"
    const filteredDepartments = departmentsData.departments.filter(department =>
      department.name.toLowerCase() !== "no department"
    );

    return filteredDepartments;

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
        if (city === 'Unknown' || state === 'Unknown') return acc;
        city = city || 'Unknown';
        state = state || 'Unknown';
        if (!acc[state]) acc[state] = [];
        if (!acc[state].find(item => item.name === city.trim())) acc[state].push({ name: city.trim(), id });
      } else if (location === 'Remote') {
        const state = 'Remote';
        if (!acc[state]) acc[state] = [];
        acc[state].push({ name: 'Remote', id: 'Remote' });
      }
      return acc;
    }, {});

    // Ensure "Remote" is always an option
    if (!stateCityMap["Remote"]) {
      stateCityMap["Remote"] = [{ name: 'Remote', id: 'Remote' }];
    }


    // Sort states alphabetically
    const sortedStateKeys = Object.keys(stateCityMap).sort();

    const formattedData = sortedStateKeys.map(state => ({
      label: state,
      // Sort cities within each state alphabetically
      options: stateCityMap[state].sort((a, b) => a.name.localeCompare(b.name)).map(({ name, id }) => ({
        value: id.toString(),
        label: name
      }))
    }));

    // Adding "Remote" under a "Other Options" or similar label
const specialOptions = [
  {
    label: "Other Options",
    options: [{ value: "Remote", label: "Remote" }]
  }
];

// Append "Other Options" to the end of the sorted list
const finalData = [...formattedData, ...specialOptions];

    // Filter out any "Unknown" labels before returning
    return finalData.filter(({ label }) => label !== 'Unknown');
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