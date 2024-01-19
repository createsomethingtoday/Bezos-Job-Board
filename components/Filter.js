import React, { useState, useRef } from 'react';
import styles from '../styles/Filter.module.css';

function Filter({ 
    employmentTypes, 
    supportTypes, 
    onKeywordFilterChange, 
    onRemoveKeywordFilter, 
    onDepartmentFilterChange, 
    onOfficeFilterChange, 
    onEmploymentTypeFilterChange, 
    onSupportTypeFilterChange, 
    keywordFilters, 
    departments,
    jobLevels,
    onJobLevelFilterChange,
    offices 
}) {
  const [keywordInput, setKeywordInput] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedOffice, setSelectedOffice] = useState('');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState('');
  const [selectedSupportType, setSelectedSupportType] = useState('');
  const [selectedJobLevel, setSelectedJobLevel] = useState(''); // Added state for selected job level

  // Create refs for each dropdown
  const departmentRef = useRef(null);
  const officeRef = useRef(null);
  const employmentTypeRef = useRef(null);
  const supportTypeRef = useRef(null);
  const jobLevelRef = useRef(null); // Ref for job level dropdown

  const handleKeywordChange = (e) => setKeywordInput(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keywordInput.trim()) {
      onKeywordFilterChange(keywordInput.trim());
      setKeywordInput('');
    }
  };

  // Function to safely get department name
  const getDepartmentName = (deptId) => {
    const department = departments.find(dept => `${dept.id}` === deptId);
    return department ? department.name : 'Unknown Department';
  };

  // Function to safely get office name
  const getOfficeName = (officeId) => {
    const office = offices.find(office => `${office.id}` === officeId);
    return office ? office.name : 'Unknown Office';
  };


  // Updated createSelectHandler
  const createSelectHandler = (onChange, setter) => (e) => {
    onChange(e.target.value);
    setter(e.target.value); // Use the passed setter function to update the state
  };

  // Update removeFilter function
  const removeFilter = (type) => {
    switch (type) {
      case 'department':
        setSelectedDepartment('');
        onDepartmentFilterChange('');
        if (departmentRef.current) departmentRef.current.value = '';
        break;
      case 'office':
        setSelectedOffice('');
        onOfficeFilterChange('');
        if (officeRef.current) officeRef.current.value = '';
        break;
      case 'employmentType':
        setSelectedEmploymentType('');
        onEmploymentTypeFilterChange('');
        if (employmentTypeRef.current) employmentTypeRef.current.value = '';
        break;
      case 'supportType':
        setSelectedSupportType('');
        onSupportTypeFilterChange('');
        if (supportTypeRef.current) supportTypeRef.current.value = '';
        break;
      case 'jobLevel':
        setSelectedJobLevel('');
        onJobLevelFilterChange('');
        if (jobLevelRef.current) jobLevelRef.current.value = '';
        break;
      // ... other cases ...
      default:
        break;
    }
  };

  return (
    <div className={styles['filter-container']}>
      <form className={styles['c-search-wrapper']} onSubmit={handleSubmit}>
      <select 
          value={selectedDepartment} 
          className={styles['c-search-select']} 
          onChange={createSelectHandler(onDepartmentFilterChange, setSelectedDepartment)}>
          <option value="">Select Department</option>
          {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
        </select>

        <select 
          value={selectedOffice} 
          className={styles['c-search-select']} 
          onChange={createSelectHandler(onOfficeFilterChange, setSelectedOffice)}>
          <option value="">Select Location</option>
          {offices.map(office => (
            <option key={office.id} value={office.id}>{office.name}</option>
          ))}
        </select>

        <select 
      value={selectedEmploymentType} 
      className={styles['c-search-select']} 
      onChange={createSelectHandler(onEmploymentTypeFilterChange, setSelectedEmploymentType)}>
      <option value="">Select Employment Type</option>
      {employmentTypes.map((type, index) => (
        <option key={index} value={type}>{type}</option>
      ))}
    </select>

    <select 
          value={selectedSupportType} 
          className={styles['c-search-select']} 
          onChange={createSelectHandler(onSupportTypeFilterChange, setSelectedSupportType)}>
          <option value="">Select Role Type</option>
          {supportTypes.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
    </select>

    <select 
  value={selectedJobLevel} 
  className={styles['c-search-select']} 
  onChange={createSelectHandler(onJobLevelFilterChange, setSelectedJobLevel)}>
  <option value="">Select Job Level</option>
  {jobLevels.map((level, index) => (
    <option key={index} value={level}>{level}</option>
  ))}
</select>

        <input className={styles['c-search-input']} type="text" value={keywordInput} onChange={handleKeywordChange} placeholder="Search Keyword" />
        <button className={styles['c-search-submit']} type="submit">Search</button>
      </form>

      {/* Update the condition to check for any filters being used */}
      {(keywordFilters.length > 0 || selectedDepartment || selectedOffice || selectedEmploymentType || selectedSupportType || selectedJobLevel) && (
        <div className={styles['filter-tag-wrapper']}>
        {keywordFilters.map((filter, index) => (
            <span key={index} className={styles['filter-tag']}>
              {filter}
              <button onClick={() => onRemoveKeywordFilter(filter)}>X</button>
            </span>
        ))}

        {/* Tags for each dropdown filter */}
        {selectedDepartment && (
          <span className={styles['filter-tag']}>
            {getDepartmentName(selectedDepartment)}
            <button onClick={() => removeFilter('department')}>X</button>
          </span>
        )}

       {/* Include a tag for selectedOffice if it's set */}
      {selectedOffice && (
        <span className={styles['filter-tag']}>
          {getOfficeName(selectedOffice)}
          <button onClick={() => removeFilter('office')}>X</button>
        </span>
      )}

      {/* Include a tag for selectedEmploymentType if it's set */}
  {selectedEmploymentType && (
    <span className={styles['filter-tag']}>
      {selectedEmploymentType}
      <button onClick={() => removeFilter('employmentType')}>X</button>
    </span>
  )}

{selectedJobLevel && (
    <span className={styles['filter-tag']}>
      Level: {selectedJobLevel}
      <button onClick={() => removeFilter('jobLevel')}>X</button>
    </span>
  )
}

  {/* Include a tag for selectedSupportType if it's set */}
  {selectedSupportType && (
        <span className={styles['filter-tag']}>
          {selectedSupportType}
          <button onClick={() => removeFilter('supportType')
}>X</button>
</span>
)}
      </div>
      )}
    </div>
  );
}

export default Filter;
