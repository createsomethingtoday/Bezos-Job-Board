import React from 'react';
import styles from '../styles/JobItem.module.css';

function JobItem({ job }) {

  const departments = job.departments 
    ? job.departments.map(dept => dept.name).join(', ') 
    : 'N/A';

  const formatLocation = (location) => {
    const parts = location.split(', ');
    return parts.length > 1 ? `${parts[0]}, ${parts[1]}` : location;
  };

  const offices = job.offices 
    ? job.offices.map(office => office.name).join(', ') 
    : 'N/A';

  // Function to determine the display text for 'In School' based on the team value
  const getInSchoolDisplay = (teamValue) => {
    switch (teamValue) {
      case 'NST':
        return 'National Support';
      case 'NSN':
        return 'In School';
      default:
        return teamValue; // Default to the original value if it's neither NSN nor NST
    }
  };

  // Extracting the team value from keyed_custom_fields
  const teamValue = job.keyed_custom_fields && job.keyed_custom_fields.team 
                     ? job.keyed_custom_fields.team.value 
                     : 'N/A';
  const inSchoolDisplay = getInSchoolDisplay(teamValue);

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  // Function to format job title by removing location if present
  const formatJobTitle = (title) => {
    // Regex pattern to match 'Title: City, State'
    const locationPattern = /:\s[^,]+,\s[^,]+$/;
    return title.replace(locationPattern, '');
  };

  // Function to get employment type
  const getEmploymentType = () => {
    return job.keyed_custom_fields && job.keyed_custom_fields.employment_type
           ? job.keyed_custom_fields.employment_type.value
           : 'N/A';
  };

  // Function to map job level to descriptive label
  const mapJobLevelToLabel = (level) => {
    switch(level) {
      case '3': return 'Entry level';
      case '4': return 'Associate';
      case '5': 
      case '6': return 'Mid-senior level';
      case '7': return 'Director';
      case '8': 
      case '9': 
      case '10': return 'Executive';
      default: return 'N/A';
    }
  };

  // Function to get job level label
  const getJobLevelLabel = () => {
    // Extract the first element from the array
    const levelArray = job.keyed_custom_fields && job.keyed_custom_fields.position_level_range
                      ? job.keyed_custom_fields.position_level_range.value
                      : ['N/A'];
    const level = levelArray[0]; // Assuming the array always contains at least one element
    return mapJobLevelToLabel(level);
  };

  const jobLevelLabel = getJobLevelLabel();

  const employmentType = getEmploymentType();

  return (
    <a href={job.absolute_url} target="_blank" rel="noopener noreferrer" className={styles['c-board-card']}>
      <div className={styles['c-card-content-wrapper']}>
        <div className={styles['c-card-label']}>Role</div>
        <div className={styles['c-card-details']}>{formatJobTitle(job.title)}</div>
      </div>

      <div className={styles['c-card-content-wrapper']}>
        <div className={styles['c-card-label']}>Employment Type</div>
        <div className={styles['c-card-details']}>{employmentType}</div>
      </div>
      
      <div className={styles['c-card-content-wrapper']}>
        <div className={styles['c-card-label']}>Role Type</div>
        <div className={styles['c-card-details']}>{inSchoolDisplay}</div>
      </div>

      <div className={styles['c-card-content-wrapper']}>
        <div className={styles['c-card-label']}>Department</div>
        <div className={styles['c-card-details']}>{departments}</div>  
      </div>

      <div className={styles['c-card-content-wrapper']}>
        <div className={styles['c-card-label']}>Location</div>
        <div className={styles['c-card-details']}>{formatLocation(job.location.name)}</div>  
      </div>

      <div className={styles['c-card-content-wrapper']}>
        <div className={styles['c-card-label']}>Job Level</div>
        <div className={styles['c-card-details']}>{jobLevelLabel}</div>
      </div>

      <div className={`${styles['c-card-content-wrapper']} ${styles['button-grid-wrapper']}`}>
        <div className={styles['c-card-button']}>
          View Job  
        </div>
      </div>
    </a>
  );
}

export default JobItem;
