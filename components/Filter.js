import React, { useState } from 'react';
import styles from 'styles/Filter.module.css';

function Filter({ employmentTypes, onKeywordFilterChange, onRemoveKeywordFilter, onDepartmentFilterChange, onOfficeFilterChange, onEmploymentTypeFilterChange, keywordFilters, departments, offices }) {
  const [keywordInput, setKeywordInput] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedOffice, setSelectedOffice] = useState('');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState('');

  const handleKeywordChange = (e) => {
    setKeywordInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keywordInput) {
      onKeywordFilterChange(keywordInput.trim());
      setKeywordInput('');
    }
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    onDepartmentFilterChange(e.target.value);
  };

  const handleOfficeChange = (e) => {
    setSelectedOffice(e.target.value);
    onOfficeFilterChange(e.target.value);
  };

  const handleEmploymentTypeChange = (e) => {
    setSelectedEmploymentType(e.target.value);
    onEmploymentTypeFilterChange(e.target.value);
  };

  return (
    <div className={styles['filter-container']}>
      <form className={styles['c-search-wrapper']} onSubmit={handleSubmit}>
        <select className={styles['c-search-select']} value={selectedDepartment} onChange={handleDepartmentChange}>
          <option value="">Select Department</option>
          {departments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>

        <select className={styles['c-search-select']} value={selectedOffice} onChange={handleOfficeChange}>
          <option value="">Select Location</option>
          {offices.map(office => (
            <option key={office.id} value={office.id}>{office.name}</option>
          ))}
        </select>

        <select className={styles['c-search-select']} value={selectedEmploymentType} onChange={handleEmploymentTypeChange}>
          <option value="">Select Employment Type</option>
          {employmentTypes.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>

        <input 
          className={styles['c-search-input']}
          type="text"
          value={keywordInput}
          onChange={handleKeywordChange}
          placeholder="Search Keyword"
        />

        <button className={styles['c-search-submit']} type="submit">Search</button>
      </form>

      <div className={styles['filter-tag-wrapper']}>
        {keywordFilters.map((filter, index) => (
          <span key={index} className={styles['filter-tag']}>
            {filter}
            <button onClick={() => onRemoveKeywordFilter(filter)}>X</button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default Filter;
