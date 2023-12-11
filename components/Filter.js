import React, { useState } from 'react';

function Filter({ onKeywordFilterChange, onLocationFilterChange, onRemoveFilter, keywordFilters, locationFilters }) {

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
<div className="c-board-search">
<form onSubmit={handleSubmit} className="c-search-wrapper">

<input 
className="c-search-input"
type="text"
value={keywordInput}
onChange={handleKeywordChange}
placeholder="Search Keyword" 
/>



<input
className="c-search-input"
type="text" 
value={locationInput}
onChange={handleLocationChange}
placeholder="Search Location" 
/>

<button type="submit"
className='c-search-button'>
Search
</button>
</form>

<div className="filter-tags">
{keywordFilters?.map((filter, index) => (
<div key={index} className="filter-tag">
{filter}
<button onClick={() => onRemoveFilter(filter)}>X</button>
</div>
))}

{locationFilters?.map((filter, index) => (
<div key={index} className="filter-tag">
{filter}
<button onClick={() => onRemoveFilter(filter)}>X</button>
</div>
))}
</div>

<style jsx>{`
.c-board-search {
background-color: #1c478c;
padding: 40px;
}

.c-search-wrapper {
grid-column-gap: 20px;
grid-row-gap: 20px;
display: flex;
}

.c-search-input {
height: 20px;
background-color: #fff;
border: 1px solid #e7e7e7;
border-radius: 50px;
flex: 1;
padding: 20px;
}

.c-search-button {
border-radius: 100%;
height: 60px;
width: 60px;
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
`}</style>
</div>
);
}

export default Filter;
