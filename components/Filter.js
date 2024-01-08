import React, { useState } from 'react';
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
    offices 
}) {
  const [keywordInput, setKeywordInput] = useState('');

  const handleKeywordChange = (e) => setKeywordInput(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keywordInput.trim()) {
      onKeywordFilterChange(keywordInput.trim());
      setKeywordInput('');
    }
  };

  const createSelectHandler = (onChange) => (e) => onChange(e.target.value);

  return (
    <div className={styles['filter-container']}>
      <form className={styles['c-search-wrapper']} onSubmit={handleSubmit}>
        <select className={styles['c-search-select']} onChange={createSelectHandler(onDepartmentFilterChange)}>
          <option value="">Select Department</option>
          {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
        </select>

        <select className={styles['c-search-select']} onChange={createSelectHandler(onOfficeFilterChange)}>
          <option value="">Select Location</option>
          {offices.map(office => <option key={office.id} value={office.id}>{office.name}</option>)}
        </select>

        <select className={styles['c-search-select']} onChange={createSelectHandler(onEmploymentTypeFilterChange)}>
          <option value="">Select Employment Type</option>
          {employmentTypes.map((type, index) => <option key={index} value={type}>{type}</option>)}
        </select>

        <select className={styles['c-search-select']} onChange={createSelectHandler(onSupportTypeFilterChange)}>
          <option value="">Select Role Type</option>
          {supportTypes.map((type, index) => <option key={index} value={type}>{type}</option>)}
        </select>

        <input className={styles['c-search-input']} type="text" value={keywordInput} onChange={handleKeywordChange} placeholder="Search Keyword" />
        <button className={styles['c-search-submit']} type="submit">Search</button>
      </form>

      {keywordFilters.length > 0 && ( // This line checks if keywordFilters array has any items
      <div className={styles['filter-tag-wrapper']}>
        {keywordFilters.map((filter, index) => (
          <span key={index} className={styles['filter-tag']}>
            {filter}
            <button onClick={() => onRemoveKeywordFilter(filter)}>X</button>
          </span>
        ))}
      </div>
    )}
    </div>
  );
}

export default Filter;
