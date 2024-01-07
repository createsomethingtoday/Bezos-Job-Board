import React from 'react';
import styles from '../styles/JobList.module.css';

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

  // Extracting the team value from keyed_custom_fields
  const team = job.keyed_custom_fields && job.keyed_custom_fields.team ? job.keyed_custom_fields.team.value : 'N/A';

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  return (
    <a href={job.absolute_url} target="_blank" rel="noopener noreferrer"className={styles['c-board-card']}>
      <div className={styles['c-card-content-wrapper']}>
        <div className={styles['c-card-label']}>Role</div>
        <div className={styles['c-card-details']}>{job.title}</div>
      </div>

      <div className={styles['c-card-content-wrapper']}>
        <div className={styles['c-card-label']}>In School</div>
        <div className={styles['c-card-details']}>{team}</div> {/* Displaying the team value here */}
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
        <div className={styles['c-card-button']}>
          View Job  
        </div>
      </div>
    </a>
  );
}

export default JobItem;
