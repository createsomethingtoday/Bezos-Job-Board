import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import JobList from '../components/JobList';
import Filter from '../components/Filter';
import { fetchActiveDepartmentsList, fetchActiveOfficesList } from '../services/greenhouseApi';
import styles from 'app/globals.css';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [keywordFilters, setKeywordFilters] = useState([]);
  const [departmentFilters, setDepartmentFilters] = useState('');
  const [officeFilters, setOfficeFilters] = useState('');
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
  const [jobLevelFilter, setJobLevelFilter] = useState(''); // Added job level filter state
  const [jobLevels, setJobLevels] = useState([]); // State to hold unique job levels

  useEffect(() => {
    fetch('/api/greenhouseJobs')
      .then(response => response.json())
      .then(data => {
        setJobs(data);
        setFilteredJobs(data);
  
        const uniqueTypes = new Set();
        const uniqueSupportTypes = new Set();
        let jobLevels = new Set(); // Use Set to ensure uniqueness
  
        data.forEach(job => {
          if (job.keyed_custom_fields?.employment_type?.value) {
            uniqueTypes.add(job.keyed_custom_fields.employment_type.value);
          }
          if (job.keyed_custom_fields?.team?.value) {
            const displayType = getInSchoolDisplay(job.keyed_custom_fields.team.value);
            uniqueSupportTypes.add(displayType);
          }
          // Check if position_level_range exists and has a value array
        if (job.keyed_custom_fields?.position_level_range?.value && Array.isArray(job.keyed_custom_fields.position_level_range.value)) {
          // Assume the first element of the array is the level and add it to the Set
          jobLevels.add(job.keyed_custom_fields.position_level_range.value[0]);
        }
        });

       // Convert Set to Array and sort numerically
      jobLevels = Array.from(jobLevels).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

      setJobLevels(jobLevels);
  
        setEmploymentTypes([...uniqueTypes]);
        setSupportTypes([...uniqueSupportTypes]);
        setJobLevels([...uniqueJobLevels]); // Convert Set to Array and set state
      })
      .catch(error => console.error('Error fetching jobs:', error));
  
    fetchActiveDepartmentsList().then(setDepartments);
    fetchActiveOfficesList().then(setOffices);
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
      const departmentMatch = !departmentFilters || job.departments?.some(dept => `${dept.id}` === departmentFilters);
      const officeMatch = !officeFilters || job.offices?.some(office => `${office.id}` === officeFilters);
      const employmentTypeMatch = !employmentTypeFilter || job.keyed_custom_fields?.employment_type?.value === employmentTypeFilter;
      const supportTypeMatch = !supportTypeFilter || getInSchoolDisplay(job.keyed_custom_fields?.team?.value) === supportTypeFilter;
      const jobLevelMatch = !jobLevelFilter || 
      (job.keyed_custom_fields?.position_level_range?.value.includes(jobLevelFilter));

      return keywordMatch && departmentMatch && officeMatch && employmentTypeMatch && supportTypeMatch && jobLevelMatch;
  });

  setFilteredJobs(filtered);
  postHeightToParent();
}, [keywordFilters, departmentFilters, officeFilters, employmentTypeFilter, supportTypeFilter, jobLevelFilter, jobLevelFilter, jobs, filteredJobs]);

  const router = useRouter();
  const contentRef = useRef();

  // Function to post height to the parent window
  const postHeightToParent = () => {
    if (window.parent && window.document.body) {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage({ height: height }, 'https://bezosacademstg.wpengine.com/');
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
    let lastHeight = document.documentElement.scrollHeight;
  
    const interval = setInterval(() => {
      const currentHeight = document.documentElement.scrollHeight;
      if (currentHeight !== lastHeight) {
        postHeightToParent();
        lastHeight = currentHeight;
      }
    }, 1000);
  
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      postHeightToParent();
    });
  
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }
  
    return () => {
      if (contentRef.current) {
        resizeObserver.unobserve(contentRef.current);
      }
    };
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
        case 'jobLevel':
      setJobLevelFilter(value);
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
        case 'jobLevel':
    setSelectedJobLevel('');
    onJobLevelFilterChange(''); // Resetting the job level filter
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
        onJobLevelFilterChange={handleDropdownFilterChange('jobLevel')} // Make sure this prop is correctly passed
        removeDropdownFilter={removeDropdownFilter}
        selectedDepartment={selectedDepartment}
        selectedOffice={selectedOffice}
        selectedEmploymentType={selectedEmploymentType}
        selectedSupportType={selectedSupportType}
        keywordFilters={keywordFilters}
        departments={departments}
        offices={offices}
        jobLevels={jobLevels}
      />
      <p><span>{filteredJobs.length}</span> of <span>{jobs.length}</span> jobs</p>
      <JobList jobs={filteredJobs} />
    </div>
  );
}
