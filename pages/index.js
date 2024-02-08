import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import JobList from '../components/JobList';
import Filter from '../components/Filter';
import { fetchActiveDepartmentsList, fetchActiveLocationsForDropdown } from '../services/greenhouseApi';
import styles from 'app/globals.css';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [keywordFilters, setKeywordFilters] = useState([]);
  const [departmentFilters, setDepartmentFilters] = useState('');
  const [officeFilters, setOfficeFilters] = useState([]);
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('');
  const [supportTypeFilter, setSupportTypeFilter] = useState('');
  const [departments, setDepartments] = useState([]);
  const [offices, setOffices] = useState([]);
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [supportTypes, setSupportTypes] = useState([]);
  // New state for selected dropdown values
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [selectedEmploymentType, setSelectedEmploymentType] = useState(null);
  const [selectedSupportType, setSelectedSupportType] = useState(null);

  useEffect(() => {
    fetch('/api/greenhouseJobs')
      .then(response => response.json())
      .then(data => {
        setJobs(data);
        setFilteredJobs(data);
  
        const uniqueTypes = new Set();
        const uniqueSupportTypes = new Set();
  
        data.forEach(job => {
          if (job.keyed_custom_fields?.employment_type?.value) {
            uniqueTypes.add(job.keyed_custom_fields.employment_type.value);
          }
          if (job.keyed_custom_fields?.team?.value) {
            const displayType = getInSchoolDisplay(job.keyed_custom_fields.team.value);
            uniqueSupportTypes.add(displayType);
          }
        });
  
        setEmploymentTypes([...uniqueTypes]);
        setSupportTypes([...uniqueSupportTypes]);
      })
      .catch(error => console.error('Error fetching jobs:', error));
  
    // These fetch calls are independent and should be outside the above `then` block.
    fetchActiveDepartmentsList().then(setDepartments);
    fetchActiveLocationsForDropdown().then(setOffices);
  }, []);
  
  const handleFilterChange = (setter) => (value) => {
    setter(value);
  };



  const getInSchoolDisplay = (teamValue) => {
    switch (teamValue) {
      case 'NST': return 'National Support';
      case 'NSN': return 'In School';
      default: return teamValue;
    }
  };

  useEffect(() => {
    const filtered = jobs.filter(job => {
      const keywordMatch = !keywordFilters.length || keywordFilters.every(filter => job.title.toLowerCase().includes(filter.toLowerCase()));
      
      // Ensure departmentMatch evaluates to true if departmentFilters has not been set
      const departmentMatch = !departmentFilters || job.departments.some(department => department.id.toString() === departmentFilters.toString());
  
      const officeMatch = !officeFilters.length || job.offices?.some(office => officeFilters.includes(`${office.id}`));
  
      // Ensure employmentTypeMatch and supportTypeMatch evaluate to true if filters have not been set
      const employmentTypeMatch = !employmentTypeFilter || job.keyed_custom_fields?.employment_type?.value === employmentTypeFilter;
      const supportTypeMatch = !supportTypeFilter || getInSchoolDisplay(job.keyed_custom_fields?.team?.value) === supportTypeFilter;
  
      return keywordMatch && departmentMatch && officeMatch && employmentTypeMatch && supportTypeMatch;
    });
  
    // Set the filtered jobs to state
    setFilteredJobs(filtered.length > 0 ? filtered : jobs);
    postHeightToParent();
  }, [keywordFilters, departmentFilters, officeFilters, employmentTypeFilter, supportTypeFilter, jobs]);
    
  

  const router = useRouter();
  const contentRef = useRef();

  // Function to post height to the parent window
const postHeightToParent = () => {
  if (window.parent && window.document.body) {
    const height = document.body.scrollHeight;
    const allowedDomains = [
      'https://bezosacademy.org/',
      'https://bezosacademystg.wpengine.com/'
    ];
    
    allowedDomains.forEach(domain => {
      window.parent.postMessage({ height: height }, domain);
    });
  }
};

  // Post height on route change complete
  useEffect(() => {
    const handleRouteChangeComplete = () => {
      postHeightToParent();
    };

    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router.events]);

  // Post height after rendering and periodically check for changes
  useEffect(() => {
    let lastHeight = document.body.scrollHeight;
  
    const interval = setInterval(() => {
      const currentHeight = document.body.scrollHeight;
      if (currentHeight !== lastHeight) {
        postHeightToParent();
        lastHeight = currentHeight;
      }
    }, 1000);
  
    return () => clearInterval(interval);
  }, []);
  

  const handleKeywordFilter = (newKeyword) => {
    setKeywordFilters(prev => newKeyword ? [...prev, newKeyword] : prev);
  };

  const removeKeywordFilter = (keywordToRemove) => {
    setKeywordFilters(prev => prev.filter(keyword => keyword !== keywordToRemove));
  };

  const handleDropdownFilterChange = (filterType) => (value) => {
    switch(filterType) {
      case 'department':
        setDepartmentFilters(value);
        setSelectedDepartment(value);
        break;
      case 'office':
        setOfficeFilters(value);
        setSelectedOffice(value);
        break;
      case 'employmentType':
        setEmploymentTypeFilter(value);
        setSelectedEmploymentType(value);
        break;
      case 'supportType':
        setSupportTypeFilter(value);
        setSelectedSupportType(value);
        break;
      default:
        break;
    }
  };

  const removeDropdownFilter = (filterType) => {
    switch(filterType) {
      case 'department':
        setDepartmentFilters('');
        setSelectedDepartment(null);
        break;
      case 'office':
        setOfficeFilters('');
        setSelectedOffice(null);
        break;
      case 'employmentType':
        setEmploymentTypeFilter('');
        setSelectedEmploymentType(null);
        break;
      case 'supportType':
        setSupportTypeFilter('');
        setSelectedSupportType(null);
        break;
      default:
        break;
    }
  };


  return (
    <div>
      <Filter
        employmentTypes={employmentTypes}
        supportTypes={supportTypes}
        onKeywordFilterChange={handleKeywordFilter}
        onRemoveKeywordFilter={removeKeywordFilter}
        onDepartmentFilterChange={handleDropdownFilterChange('department')}
        onOfficeFilterChange={handleDropdownFilterChange('office')}
        onEmploymentTypeFilterChange={handleDropdownFilterChange('employmentType')}
        onSupportTypeFilterChange={handleDropdownFilterChange('supportType')}
        removeDropdownFilter={removeDropdownFilter}
        selectedDepartment={selectedDepartment}
        selectedOffice={selectedOffice}
        selectedEmploymentType={selectedEmploymentType}
        selectedSupportType={selectedSupportType}
        keywordFilters={keywordFilters}
        departments={departments}
        offices={offices}
      />
      <p><span>{filteredJobs.length}</span> of <span>{jobs.length}</span> jobs</p>
      <JobList jobs={filteredJobs} />
    </div>
  );
}
