import { useEffect, useState } from 'react';
import JobList from '../components/JobList';
import Filter from '../components/Filter';
import { fetchDepartments, fetchOffices } from '../services/greenhouseApi';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [keywordFilters, setKeywordFilters] = useState([]);
  const [departmentFilters, setDepartmentFilters] = useState('');
  const [officeFilters, setOfficeFilters] = useState('');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('');
  const [departments, setDepartments] = useState([]);
  const [offices, setOffices] = useState([]);
  const [employmentTypes, setEmploymentTypes] = useState([]);

  useEffect(() => {
    fetch('/api/greenhouseJobs')
      .then(response => response.json())
      .then(data => {
        setJobs(data);
        setFilteredJobs(data);
        const uniqueTypes = new Set();
        data.forEach(job => {
          if (job.keyed_custom_fields && job.keyed_custom_fields.employment_type) {
            uniqueTypes.add(job.keyed_custom_fields.employment_type.value);
          }
        });
        setEmploymentTypes([...uniqueTypes]);
      })
      .catch(error => console.error('Error fetching jobs:', error));
    fetchDepartments().then(setDepartments);
    fetchOffices().then(setOffices);
  }, []);

  const handleKeywordFilter = (newKeyword) => {
    setKeywordFilters(prevKeywords => {
      if (newKeyword && typeof newKeyword === 'string' && !prevKeywords.includes(newKeyword)) {
        return [...prevKeywords, newKeyword];
      }
      return prevKeywords;
    });
  };

  const removeKeywordFilter = (keywordToRemove) => {
    setKeywordFilters(prevKeywords => prevKeywords.filter(keyword => keyword !== keywordToRemove));
  };

  const handleDepartmentFilter = (departmentId) => {
    setDepartmentFilters(departmentId);
  };

  const handleOfficeFilter = (officeId) => {
    setOfficeFilters(officeId);
  };

  const handleEmploymentTypeFilter = (type) => {
    setEmploymentTypeFilter(type);
  };

  useEffect(() => {
    const filtered = jobs.filter(job => {
      const keywordMatch = keywordFilters.length === 0 || keywordFilters.some(filter => job.title.toLowerCase().includes(filter.toLowerCase()));
      const departmentMatch = !departmentFilters || (job.departments && job.departments.some(dept => `${dept.id}` === departmentFilters));
      const officeMatch = !officeFilters || (job.offices && job.offices.some(office => `${office.id}` === officeFilters));
      const employmentTypeMatch = !employmentTypeFilter || (job.keyed_custom_fields && job.keyed_custom_fields.employment_type && job.keyed_custom_fields.employment_type.value === employmentTypeFilter);

      return keywordMatch && departmentMatch && officeMatch && employmentTypeMatch;
    });

    setFilteredJobs(filtered);
  }, [keywordFilters, departmentFilters, officeFilters, employmentTypeFilter, jobs]);

  return (
    <div>
      <Filter
        employmentTypes={employmentTypes}
        onKeywordFilterChange={handleKeywordFilter}
        onRemoveKeywordFilter={removeKeywordFilter}
        onDepartmentFilterChange={handleDepartmentFilter}
        onOfficeFilterChange={handleOfficeFilter}
        onEmploymentTypeFilterChange={handleEmploymentTypeFilter}
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
