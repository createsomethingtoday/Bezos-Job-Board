import { useEffect, useState } from 'react';
import JobList from '../components/JobList';
import Filter from '../components/Filter';
import { fetchJobs } from '../services/greenhouseApi';

export default function Home() {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [filters, setFilters] = useState([]);

    useEffect(() => {
        fetchJobs(true).then(data => {
            setJobs(data);
            setFilteredJobs(data);
        });
    }, []);

    const handleFilterChange = (newFilter) => {
        if (!filters.includes(newFilter)) {
            setFilters([...filters, newFilter]);
        }
    };

    const handleRemoveFilter = (filterToRemove) => {
        setFilters(filters.filter(filter => filter !== filterToRemove));
    };

    useEffect(() => {
        const filtered = jobs.filter(job =>
            filters.every(filter =>
                job.title.toLowerCase().includes(filter.toLowerCase()) ||
                job.location.name.toLowerCase().includes(filter.toLowerCase()) ||
                (job.departments && job.departments.some(dept => dept.name.toLowerCase().includes(filter.toLowerCase())))
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
            <p>{`${filteredJobs.length} of ${jobs.length}`}</p>
            <JobList jobs={filteredJobs} />
        </div>
    );
}
