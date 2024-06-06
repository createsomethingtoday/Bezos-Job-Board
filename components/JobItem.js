import React from 'react';
import { track } from '@vercel/analytics';
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

  const employmentType = getEmploymentType();

  // Extracting the job ID from the absolute_url
  const jobId = job.absolute_url.split('/').pop();

  // Construct the new job URL with the extracted job ID
  const jobUrl = `https://bezosacademy.org/open-roles-details/?gh_jid=${jobId}`;

  const handleViewJobClick = () => {
    track('View Job', { jobId, jobName: job.title });
  };

  return (
    <a href={jobUrl} target="_top" rel="noopener noreferrer" className={styles['c-board-card']}>
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

      <div className={`${styles['c-card-content-wrapper']} ${styles['button-grid-wrapper']}`}>
        <div className={styles['c-card-button']} onClick={handleViewJobClick}>
          View Job  
        </div>
      </div>
    </a>
  );
}

export default JobItem;
