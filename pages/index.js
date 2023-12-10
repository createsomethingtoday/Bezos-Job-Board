import { useEffect, useState } from 'react';
import JobList from '../components/JobList';
import Filter from '../components/Filter';
import { fetchJobs } from '../services/greenhouseApi';

export default function Home() {

const [jobs, setJobs] = useState([]);
const [filteredJobs, setFilteredJobs] = useState([]);  
const [keywordFilters, setKeywordFilters] = useState([]);
const [locationFilters, setLocationFilters] = useState([]);

useEffect(() => {
fetchJobs().then(data => {
    setJobs(data);
    setFilteredJobs(data); 
});
}, []);

const handleKeywordFilterChange = (newFilter) => {
if (!keywordFilters.includes(newFilter)) {
    setKeywordFilters([...keywordFilters, newFilter]);
}
};

const handleLocationFilterChange = (newFilter) => {
if (!locationFilters.includes(newFilter)) {
    setLocationFilters([...locationFilters, newFilter]); 
}
};

const handleRemoveFilter = (filterToRemove) => {
setKeywordFilters(keywordFilters.filter(f => f !== filterToRemove));
setLocationFilters(locationFilters.filter(f => f !== filterToRemove));
};

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
    onKeywordFilterChange={handleKeywordFilterChange}
    onLocationFilterChange={handleLocationFilterChange}
    keywordFilters={keywordFilters}
    locationFilters={locationFilters}
    onRemoveFilter={handleRemoveFilter} 
    />
    <p><span className="filtered-jobs">{filteredJobs.length}</span> of <span className="total-jobs">{jobs.length}</span></p>
    <JobList jobs={filteredJobs} />
</div>
);
}