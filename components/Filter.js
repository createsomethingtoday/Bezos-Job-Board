import React, { useState, useRef } from 'react';
import styles from '../styles/Filter.module.css';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: '42px', // Add min-height of 42px
    borderColor: state.isFocused ? '#1c478c' : provided.borderColor,
    '&:hover': {
      borderColor: state.isFocused ? '#1c478c' : provided.borderColor,
    },
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    flexWrap: 'nowrap', // Prevent wrapping of tags
  })
  // Add other custom parts as needed
};


const Filter = ({
  employmentTypes,
  supportTypes,
  onKeywordFilterChange,
  onRemoveKeywordFilter,
  onDepartmentFilterChange,
  onOfficeFilterChange,
  onEmploymentTypeFilterChange,
  onSupportTypeFilterChange,
  removeDropdownFilter,
  departments,
  offices,
  selectedOffice,
  setSelectedOffice,
  keywordFilters
}) => {
  const [keywordInput, setKeywordInput] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState(null);
  const [selectedSupportType, setSelectedSupportType] = useState(null);
  // State to control the visibility of the select-container
  const [showSelects, setShowSelects] = useState(false);
  // Function to toggle the select-container visibility
  const toggleSelectVisibility = () => {
    setShowSelects(!showSelects);
  };
  console.log('Selected offices prop:', selectedOffice);

  // Create refs for each dropdown
  const departmentRef = useRef(null);
  const officeRef = useRef(null);
  const employmentTypeRef = useRef(null);
  const supportTypeRef = useRef(null);
  // Assuming employmentTypes is an array of strings like ['Full-time', 'Part-time']
  const employmentTypeOptions = employmentTypes.map(type => ({ value: type, label: type }));
  const supportTypeOptions = supportTypes.map(type => ({ value: type, label: type }));
  const departmentOptions = departments.map(dept => ({ value: dept.id, label: dept.name }));

  const handleKeywordChange = (e) => setKeywordInput(e.target.value);
  const handleOfficeChange = (selectedOptions) => {
    console.log("Selected offices:", selectedOptions); // Debugging line
    onOfficeFilterChange(selectedOptions); // Call the prop function to update the parent component's state
  };
  
  const clearAllFilters = () => {
    // Reset the local state for all filters
    setKeywordInput('');
    setSelectedDepartment(null);
    setSelectedOffice([]);
    setSelectedEmploymentType(null);
    setSelectedSupportType(null);
  
    // Clear all keyword filters
    // Assuming onRemoveKeywordFilter can handle an empty array to clear all
    keywordFilters.forEach(filter => {
      onRemoveKeywordFilter(filter);
    });
    
    // Reset the keywordFilters if it's part of the component's state
    // (The following line would only be necessary if keywordFilters is a state variable within this component)
    // setKeywordFilters([]);
  
    // Call the prop functions to update the parent component's state
    onKeywordFilterChange('');
    onDepartmentFilterChange('');
    onOfficeFilterChange([]);
    onEmploymentTypeFilterChange('');
    onSupportTypeFilterChange('');
  
    // Directly reset the Select components if needed
    if (departmentRef.current) departmentRef.current.clearValue();
    if (officeRef.current) officeRef.current.clearValue();
    if (employmentTypeRef.current) employmentTypeRef.current.clearValue();
    if (supportTypeRef.current) supportTypeRef.current.clearValue();
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keywordInput.trim()) {
      onKeywordFilterChange(keywordInput.trim());
      setKeywordInput('');
    }
  };

  // Function to safely get department name
  const getDepartmentNames = (deptIds) => {
    return deptIds.map(deptId => {
      const department = departments.find(dept => `${dept.id}` === deptId.value);
      return department ? department.name : 'Unknown Department';
    }).join(', ');
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
        setSelectedDepartment(null);
        onDepartmentFilterChange('');
        if (departmentRef.current) departmentRef.current.value = '';
        break;
      case 'office':
        setSelectedOffice(null);
        onOfficeFilterChange('');
        if (officeRef.current) officeRef.current.value = '';
        break;
        case 'employmentType':
        setSelectedEmploymentType(null); // Clear the selection
        onEmploymentTypeFilterChange(''); // Notify parent component or perform necessary action
        break;
      case 'supportType':
        setSelectedSupportType(null);
        onSupportTypeFilterChange('');
        if (supportTypeRef.current) supportTypeRef.current.value = '';
        break;
      // ... other cases ...
      default:
        break;
    }
  };

  // Right before the return statement of your Filter component
  const removeOfficeFilter = (officeToRemove) => {
    const updatedOffices = selectedOffice.filter(office => office.value !== officeToRemove.value);
    setSelectedOffice(updatedOffices); // This should now work as expected
  };
  



  return (
    <div className={styles['filter-container']}>
      <button
        className={styles['mobile-filter-button']}
        onClick={toggleSelectVisibility}
      >
        {showSelects ? 'Hide Filters' : 'Show Filters'}
      </button>
      <form className={styles['c-search-wrapper']} onSubmit={handleSubmit}>
        <div className={`${styles['select-container']} ${showSelects ? styles['show'] : ''}`}>
          <Select
            className={styles['basic-multi-select']}
            value={selectedDepartment}
            onChange={(option) => {
              setSelectedDepartment(option);
              onDepartmentFilterChange(option ? option.value : '');
            }}
            options={departments.map(dept => ({ value: dept.id, label: dept.name }))}
            isClearable={true}
            placeholder="Department"
            classNamePrefix="select"
            styles={customSelectStyles}
          />
            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              options={offices}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={(selectedOptions) => onOfficeFilterChange(selectedOptions)}
              value={selectedOffice}
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.value}
              placeholder="Location"
              styles={customSelectStyles}
            />
          <Select
            className={styles['basic-multi-select']}
            value={selectedEmploymentType}
            onChange={(option) => {
              setSelectedEmploymentType(option);
              onEmploymentTypeFilterChange(option ? option.value : '');
            }}
            options={employmentTypes.map(type => ({ value: type, label: type }))}
            isClearable={true}
            placeholder="Employment Type"
            classNamePrefix="select"
            styles={customSelectStyles}
          />
          <Select
            className={styles['basic-multi-select']}
            value={selectedSupportType}
            onChange={(option) => {
              setSelectedSupportType(option);
              onSupportTypeFilterChange(option ? option.value : '');
            }}
            options={supportTypes.map(type => ({ value: type, label: type }))}
            isClearable={true}
            placeholder="Role Type"
            classNamePrefix="select"
            styles={customSelectStyles}
          />
        </div>
        <input
          className={styles['c-search-input']}
          type="text"
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          placeholder="Search"
        />
        <button className={styles['c-search-submit']} type="submit">Search</button>
      </form>

      {/* Update the condition to check for any filters being used */}
      {(keywordFilters.length > 0 || selectedDepartment || selectedOffice && selectedOffice.length > 0 || selectedEmploymentType || selectedSupportType) && (
        <div className={styles['filter-tag-wrapper']}>
        {keywordFilters.map((filter, index) => (
            <span key={index} className={styles['filter-tag']} onClick={() => onRemoveKeywordFilter(filter)}>
              {filter}
              <button onClick={() => onRemoveKeywordFilter(filter)}>X</button>
            </span>
        ))}

        {/* Tags for each selected department */}
        {selectedDepartment && (
        <span className={styles['filter-tag']} onClick={() => removeFilter('department')}>
          {selectedDepartment.label} {/* Use .label directly from the selectedDepartment object */}
          <button onClick={() => removeFilter('department')}>X</button>
        </span>
      )}

       {/* Include a tag for selectedOffice if it's set */}
        {selectedOffice && selectedOffice.length > 0 && selectedOffice.map((office, index) => (
          <span key={index} className={styles['filter-tag']} onClick={() => removeOfficeFilter(office)}>
            {office.label}
            <button type="button" onClick={() => removeOfficeFilter(office)}>X</button>
          </span>
      ))}




      {/* Include a tag for selectedEmploymentType if it's set */}
      {selectedEmploymentType && (
        <span className={styles['filter-tag']} onClick={() => removeFilter('employmentType')}>
          {selectedEmploymentType.label} {/* Use .label to render the string */}
          <button onClick={() => removeFilter('employmentType')}>X</button>
        </span>
      )}

  {/* Include a tag for selectedSupportType if it's set */}
  {selectedSupportType && (
        <span className={styles['filter-tag']} onClick={() => removeFilter('supportType')}>
          {selectedSupportType.label}
          <button onClick={() => removeFilter('supportType')
          }>X</button>
          </span>
)}
{/* Add Clear All Filters Button */}
{ (keywordFilters.length > 0 || selectedDepartment || selectedOffice && selectedOffice.length > 0 || selectedEmploymentType || selectedSupportType) && (
    <button className={styles['clear-all-filters']} onClick={clearAllFilters}>Clear All Filters</button>
  )}
      </div>
      )}
    </div>
  );
}

export default Filter;
