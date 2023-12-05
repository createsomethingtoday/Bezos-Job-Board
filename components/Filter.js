// components/Filter.js

import React, { useState } from 'react';

function Filter({ onFilterChange, filters, onRemoveFilter }) {
    const [input, setInput] = useState('');

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onFilterChange(input);
        setInput('');
    };

    return (
        <div>
            <form onSubmit={handleFormSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Search"
                />
                <input type="submit" value="Search" />
            </form>
            <div className="filter-tags">
                {filters.map((filter, index) => (
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
