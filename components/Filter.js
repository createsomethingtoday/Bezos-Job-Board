import React, { useState, useRef } from 'react';
import styles from '../styles/Filter.module.css';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? '#1c478c' : provided.borderColor,
    boxShadow: state.isFocused ? '0 0 0 1px #1c478c' : provided.boxShadow,
    '&:hover': {
      borderColor: state.isFocused ? '#1c478c' : provided.borderColor,
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#f5f5f6' : provided.backgroundColor,
    color: state.isSelected ? '#1c478c' : provided.color,
    '&:hover': {
      backgroundColor: '#f5f5f6',
      color: '#1c478c',
    },
  }),
  // Add any other custom styles for different parts of the Select component
};

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
    offices,
    officeFilters
}) {
  const [keywordInput, setKeywordInput] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedOffice, setSelectedOffice] = useState('');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState(null);
  const [selectedSupportType, setSelectedSupportType] = useState('');

  // Create refs for each dropdown
  const departmentRef = useRef(null);
  const officeRef = useRef(null);
  const employmentTypeRef = useRef(null);
  const supportTypeRef = useRef(null);
  // Assuming employmentTypes is an array of strings like ['Full-time', 'Part-time']
const employmentTypeOptions = employmentTypes.map(type => ({ value: type, label: type }));


  const handleKeywordChange = (e) => setKeywordInput(e.target.value);
  const handleOfficeChange = selectedOptions => {
    const selectedValues = selectedOptions || [];
    onOfficeFilterChange(selectedValues.map(option => option.value));
  };

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
        setSelectedEmploymentType(null); // Clear the selection
        onEmploymentTypeFilterChange(''); // Notify parent component or perform necessary action
        break;
      case 'supportType':
        setSelectedSupportType('');
        onSupportTypeFilterChange('');
        if (supportTypeRef.current) supportTypeRef.current.value = '';
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

        <Select
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
          options={offices} // This is your fetched and structured data
          className={styles['basic-multi-select']}
          classNamePrefix="select"
          onChange={selectedOptions => handleOfficeChange(selectedOptions)}
          styles={customSelectStyles}
          placeholder="Select Role"
          value={selectedOffice} // Ensure this is updated to handle an array of selected values
        />

        <Select
          className={styles['basic-multi-select']}
          value={selectedEmploymentType} // Ensure this is the object or null
          onChange={option => {
            setSelectedEmploymentType(option); // option is already in the correct format
            onEmploymentTypeFilterChange(option ? option.value : '');
          }}
          options={employmentTypeOptions}
          isClearable={true} // Allows clearing the selection
          placeholder="Select Employment"
          classNamePrefix="select"
          styles={customSelectStyles}
        />
        

    <select 
          value={selectedSupportType} 
          className={styles['c-search-select']} 
          onChange={createSelectHandler(onSupportTypeFilterChange, setSelectedSupportType)}>
          <option value="">Select Role Type</option>
          {supportTypes.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
    </select>

        <input className={styles['c-search-input']} type="text" value={keywordInput} onChange={handleKeywordChange} placeholder="Search Keyword" />
        <button className={styles['c-search-submit']} type="submit">Search</button>
      </form>

      {/* Update the condition to check for any filters being used */}
      {(keywordFilters.length > 0 || selectedDepartment || selectedOffice || selectedEmploymentType || selectedSupportType) && (
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
          {selectedEmploymentType.label} {/* Use .label to render the string */}
          <button onClick={() => removeFilter('employmentType')}>X</button>
        </span>
      )}

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
