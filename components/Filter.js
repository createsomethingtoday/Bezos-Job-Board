import React, { useState } from 'react';

function Filter({ onKeywordFilterChange, onLocationFilterChange, keywordFilters, locationFilters, onRemoveFilter }) {

  const [keywordInput, setKeywordInput] = useState('');
  const [locationInput, setLocationInput] = useState('');

  const handleKeywordChange = (e) => {
    setKeywordInput(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocationInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (keywordInput) {
      onKeywordFilterChange(keywordInput);
      setKeywordInput(''); 
    }

    if (locationInput) {
      onLocationFilterChange(locationInput);
      setLocationInput('');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          value={keywordInput}
          onChange={handleKeywordChange}
          placeholder="Search Keyword" 
        />

        <input
          type="text" 
          value={locationInput}
          onChange={handleLocationChange}
          placeholder="Search Location" 
        />

        <button type="submit">
          Search
        </button>
      </form>

      <div className="filter-tags">
        {keywordFilters.map((filter, index) => (
          <div key={index} className="filter-tag">
            {filter}
            <button onClick={() => onRemoveFilter(filter)}>X</button>
          </div>
        ))}
        
        {locationFilters.map((filter, index) => (
          <div key={index} className="filter-tag">
            {filter}
            <button onClick={() => onRemoveFilter(filter)}>X</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Filter;