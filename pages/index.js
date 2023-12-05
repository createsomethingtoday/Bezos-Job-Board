import { useEffect, useState } from 'react';
import JobList from '../components/JobList';
import Filter from '../components/Filter';
import { fetchJobs } from '../services/greenhouseApi';

export default function Home() {
    const [jobs, setJobs] = useState([]); // All jobs
    const [filteredJobs, setFilteredJobs] = useState([]); // Jobs after filtering
    const [filters, setFilters] = useState([]); // Active filters

    // Fetch jobs on component mount
    useEffect(() => {
        fetchJobs(true).then(data => {
            setJobs(data);
            setFilteredJobs(data); // Initially, all jobs are visible
        });
    }, []);

    // Handle addition of a new filter
    const handleFilterChange = (newFilter) => {
        if (!filters.includes(newFilter)) {
            setFilters([...filters, newFilter]);
        }
    };

    // Handle removal of a filter
    const handleRemoveFilter = (filterToRemove) => {
        setFilters(filters.filter(filter => filter !== filterToRemove));
    };

    // Apply filters to jobs
    useEffect(() => {
        const filtered = jobs.filter(job =>
            filters.every(filter =>
                job.title.toLowerCase().includes(filter.toLowerCase()) ||
                job.location.name.toLowerCase().includes(filter.toLowerCase())
            )
        );
        setFilteredJobs(filtered);
    }, [filters, jobs]);

    return (
        <div>
            <Filter
                onFilterChange={handleFilterChange}
                filters={filters}
                onRemoveFilter={handleRemoveFilter}
            />
            <p>{`${filteredJobs.length} of ${jobs.length}`}</p> {/* Display count of visible jobs */}
            <JobList jobs={filteredJobs} />
        </div>
    );
}
