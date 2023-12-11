import React from 'react';
import styles from '../styles/JobList.module.css';

function JobItem({ job }) {

  const departments = job.departments ? job.departments.map(dept => dept.name).join(', ') : 'N/A';

  // Function to format the date
  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  return (
    <div className={styles['c-board-card']}>
      <div className={styles['c-card-content-wrapper']}>
        <div className={styles['c-card-title']}>{job.title}</div>
        <div className={styles['c-card-label']}>{formatDate(job.updated_at)}</div>
      </div>

      <div className={styles['c-card-content-wrapper']}>
        <div className={styles['c-card-label']}>Location</div>
        <div className={styles['c-card-details']}>{job.location.name}</div>
      </div>

      <div className={styles['c-card-content-wrapper']}>
        <div className={styles['c-card-label']}>Department</div>
        <div className={styles['c-card-details']}>{departments}</div>  
      </div>

      <div className={`${styles['c-card-content-wrapper']} ${styles['button-grid-wrapper']}`}>
        <a href={job.absolute_url} className={styles['c-card-button']} target="_blank" rel="noopener noreferrer">
          View Job  
        </a>
      </div>
    </div>
  );
}

export default JobItem;
