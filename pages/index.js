import { useEffect, useState } from 'react';

import JobList from '../components/JobList';
import Filter from '../components/Filter';

import { fetchJobs } from '../services/greenhouseApi';

export default function Home() {

// State
const [jobs, setJobs] = useState([]);
const [filteredJobs, setFilteredJobs] = useState([]);
const [keywordFilters, setKeywordFilters] = useState([]);
const [locationFilters, setLocationFilters] = useState([]);

// Fetch jobs
useEffect(() => {
    fetchJobs(true).then(data => {
    setJobs(data); 
    setFilteredJobs(data);
    });
}, []);

// Keyword filter
const handleKeywordFilter = (newFilter) => {
    if (!keywordFilters.includes(newFilter)) {
    setKeywordFilters(prev => [...prev, newFilter]);
    }
};

// Location filter 
const handleLocationFilter = (newFilter) => {
    if (!locationFilters.includes(newFilter)) {
    setLocationFilters(prev => [...prev, newFilter]);
    }
};

// Remove filter
const handleRemoveFilter = (filter) => {
    setKeywordFilters(prev => prev.filter(f => f !== filter));
    setLocationFilters(prev => prev.filter(f => f !== filter));
};

// Filter logic
useEffect(() => {
    const filtered = jobs.filter(job => {
    const keywordMatch = keywordFilters.every(filter => {
        return job.title.toLowerCase().includes(filter.toLowerCase()) ||
        (job.departments && job.departments.some(dept => dept.name.toLowerCase().includes(filter.toLowerCase())));
    });

    const locationMatch = !locationFilters.length || locationFilters.some(filter => {
        return job.location.name.toLowerCase().includes(filter.toLowerCase());  
    });

    return keywordMatch && locationMatch;
    });

    setFilteredJobs(filtered);

}, [keywordFilters, locationFilters, jobs]);

return (
    <div>
    <Filter
  onKeywordFilterChange={handleKeywordFilter}
  onLocationFilterChange={handleLocationFilter}
  onRemoveFilter={handleRemoveFilter} // Changed from onRemove to onRemoveFilter
  keywordFilters={keywordFilters}
  locationFilters={locationFilters}
/>
    <p>
        <span>{filteredJobs.length}</span> of <span>{jobs.length}</span>
    </p>

    <JobList jobs={filteredJobs} />
    </div>
);
}
