import { useEffect, useState } from 'react';

import JobList from '../components/JobList';
import Filter from '../components/Filter';
// Import fetchDepartments and fetchOffices if they are still needed

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [keywordFilters, setKeywordFilters] = useState([]);
  const [departmentFilters, setDepartmentFilters] = useState('');
  const [officeFilters, setOfficeFilters] = useState('');
  const [departments, setDepartments] = useState([]);
  const [offices, setOffices] = useState([]);

  // Fetch jobs, departments, and offices
  useEffect(() => {
    // Fetch enriched job data from the greenhouseJobs API route
    fetch('/api/greenhouseJobs')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setJobs(data);
        setFilteredJobs(data);
      })
      .catch(error => console.error('Error fetching jobs:', error));

    // Fetch departments and offices if needed
    // fetchDepartments().then(setDepartments);
    // fetchOffices().then(setOffices);
  }, []);

  // Function to format the date
  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  // Keyword filter
  const handleKeywordFilter = (newFilter) => {
    if (!keywordFilters.includes(newFilter)) {
      setKeywordFilters(prev => [...prev, newFilter]);
    }
  };

  // Department filter
  const handleDepartmentFilter = (departmentId) => {
    setDepartmentFilters(departmentId);
  };

  // Office (Location) filter 
  const handleOfficeFilter = (officeId) => {
    setOfficeFilters(officeId);
  };

  // Remove filter
  const handleRemoveFilter = (filter, filterType) => {
    if (filterType === 'keyword') {
      setKeywordFilters(prev => prev.filter(f => f !== filter));
    } else if (filterType === 'department') {
      setDepartmentFilters('');
    } else if (filterType === 'office') {
      setOfficeFilters('');
    }
  };

  // Filter logic
  useEffect(() => {
    const filtered = jobs.filter(job => {
      const keywordMatch = keywordFilters.length === 0 || keywordFilters.every(filter => job.title.toLowerCase().includes(filter.toLowerCase()));
      
      const departmentMatch = !departmentFilters || (job.departments && job.departments.some(dept => `${dept.id}` === departmentFilters));
      
      const officeMatch = !officeFilters || (job.offices && job.offices.some(office => `${office.id}` === officeFilters));

      return keywordMatch && departmentMatch && officeMatch;
    });

    setFilteredJobs(filtered);

  }, [keywordFilters, departmentFilters, officeFilters, jobs]);

  return (
    <div>
      <Filter
        onKeywordFilterChange={handleKeywordFilter}
        onDepartmentFilterChange={handleDepartmentFilter}
        onOfficeFilterChange={handleOfficeFilter}
        onRemoveFilter={handleRemoveFilter}
        keywordFilters={keywordFilters}
        departments={departments}
        offices={offices}
      />
      <p>
        <span>{filteredJobs.length}</span> of <span>{jobs.length}</span> jobs
      </p>
      <JobList jobs={filteredJobs} />
    </div>
  );
}
