import React, { useState } from 'react';

function Filter({ onKeywordFilterChange, onDepartmentFilterChange, onOfficeFilterChange, onRemoveFilter, keywordFilters, departments, offices }) {
const [keywordInput, setKeywordInput] = useState('');
const [selectedDepartment, setSelectedDepartment] = useState('');
const [selectedOffice, setSelectedOffice] = useState('');

const handleKeywordChange = (e) => {
setKeywordInput(e.target.value);
};

const handleSubmit = (e) => {
e.preventDefault();
if (keywordInput) {
    onKeywordFilterChange(keywordInput);
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

return (
<div className="filter-container">
    <form className="c-search-wrapper" onSubmit={handleSubmit}>

    <select className="c-search-select" value={selectedDepartment} onChange={handleDepartmentChange}>
        <option value="">Select Department</option>
        {departments.map((dept) => (
        <option key={dept.id} value={dept.id}>{dept.name}</option>
        ))}
    </select>

    <select className="c-search-select" value={selectedOffice} onChange={handleOfficeChange}>
        <option value="">Select Location</option>
        {offices.map((office) => (
        <option key={office.id} value={office.id}>{office.name}</option>
        ))}
    </select>

    <input 
    className='c-search-input'
        type="text"
        value={keywordInput}
        onChange={handleKeywordChange}
        placeholder="Search Keyword"
    />

    <button className="c-search-submit" type="submit">Search</button>
    </form>

    <div>
    <div className="filter-tag-wrapper">
    {keywordFilters.map((filter, index) => (
        <span key={index} className="filter-tag">
            {filter}
            <button onClick={() => onRemoveFilter(filter, 'keyword')}>X</button>
        </span>
    ))}
</div>
</div>
    <style jsx>{`
.c-board-search {
padding: 20px;
}

.c-search-wrapper {
grid-column-gap: 20px;
grid-row-gap: 20px;
display: flex;
}

.c-search-input {
border-bottom: 1px solid #1c478c;
background-image: url('../images/icon-search--blue.svg');
background-position: 99%;
background-repeat: no-repeat;
background-size: auto 20px;
flex: 1;
border-top: 0px;
border-right: 0px;
border-left: 0px;
}

.filter-tag {
grid-column-gap: 5px;
grid-row-gap: 5px;
display: flex;
}

.filter-tag-wrapper {
  display: flex;
  padding: 5px;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  }

.c-search-select {
height: 40px;
color: #1c478c;
background-color: #fff;
flex: 1;
}

.c-search-select:hover {
background-color: #f5f5f6;
}

.c-search-submit {
height: 40px;
background-color: #1c478c;
color: #fff;
padding: 0px 30px;
border: 0px;
}

.filter-tags {
grid-column-gap: 10px;
grid-row-gap: 10px;
color: #fff;
padding: 10px;
display: flex;
}

.filter-tag {

}

@media screen and (max-width: 767px) {
  .c-search-wrapper {
    flex-direction: column;
  }

  .c-search-select {
    flex: none;
  }
}
`}</style>
</div>
);
}

export default Filter;
