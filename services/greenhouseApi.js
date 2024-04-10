// services/greenhouseApi.js
const BASE_URL = 'https://boards-api.greenhouse.io/v1/boards/day1academies';
const CACHE_EXPIRATION = 60 * 60 * 1000; // Cache for 1 hour (in milliseconds)

const cache = {
  jobs: null,
  jobsTimestamp: null,
  departments: null,
  departmentsTimestamp: null,
  locations: null,
  locationsTimestamp: null,
};

export const fetchJobs = async (includeContent = false) => {
  if (cache.jobs && cache.jobsTimestamp && Date.now() - cache.jobsTimestamp < CACHE_EXPIRATION) {
    return cache.jobs;
  }

  try {
    const url = includeContent ? `${BASE_URL}/jobs?content=true` : BASE_URL;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const jobsData = await response.json();
    cache.jobs = jobsData.jobs;
    cache.jobsTimestamp = Date.now();
    return jobsData.jobs;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
};

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

export const fetchActiveDepartmentsList = async () => {
  if (cache.departments && cache.departmentsTimestamp && Date.now() - cache.departmentsTimestamp < CACHE_EXPIRATION) {
    return cache.departments;
  }

  try {
    const response = await fetch(`${BASE_URL}/departments?render_as=list`);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const departmentsData = await response.json();
    const filteredDepartments = departmentsData.departments.filter(
      department => department.name.toLowerCase() !== "no department"
    );
    cache.departments = filteredDepartments;
    cache.departmentsTimestamp = Date.now();
    return filteredDepartments;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
};

export const fetchActiveLocationsForDropdown = async () => {
  if (cache.locations && cache.locationsTimestamp && Date.now() - cache.locationsTimestamp < CACHE_EXPIRATION) {
    return cache.locations;
  }

  try {
    const url = 'https://boards-api.greenhouse.io/v1/boards/day1academies/offices?render_as=list';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch offices data');
    }
    const { offices } = await response.json();
    const stateCityMap = offices.reduce((acc, office) => {
      const { id, location } = office;
      if (location && location !== 'Remote') {
        let [_, state, city] = location.split(', ').reverse();
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

    if (!stateCityMap["Remote"]) {
      stateCityMap["Remote"] = [{ name: 'Remote', id: 'Remote' }];
    }

    const sortedStateKeys = Object.keys(stateCityMap).sort();
    const formattedData = sortedStateKeys.map(state => ({
      label: state,
      options: stateCityMap[state].sort((a, b) => a.name.localeCompare(b.name)).map(({ name, id }) => ({
        value: id.toString(),
        label: name
      }))
    }));

    const specialOptions = [
      {
        label: "Other Options",
        options: [{ value: "Remote", label: "Remote" }]
      }
    ];

    const finalData = [...formattedData, ...specialOptions];
    cache.locations = finalData.filter(({ label }) => label !== 'Unknown');
    cache.locationsTimestamp = Date.now();
    return cache.locations;
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