import React from 'react';
import JobItem from './JobItem';
import styles from './JobList.module.css';

function JobList({ jobs }) {
  const getStateOrLabel = (locationName) => {
    if (!locationName) return 'Remote'; // Assuming 'Remote' or 'Multiple' are handled differently in your application logic
    const parts = locationName.split(', ');
    // Assuming the state is always the second part of the location name
    return parts[1] || 'Multiple';
  };
  

  const groupJobsByStateOrLabel = (jobs) => {
    return jobs.reduce((grouped, job) => {
      const stateOrLabel = getStateOrLabel(job.location.name);
      if (!grouped[stateOrLabel]) {
        grouped[stateOrLabel] = [];
      }
      grouped[stateOrLabel].push(job);
      return grouped;
    }, {});
  };

  const groupedJobs = groupJobsByStateOrLabel(jobs);
  const sortedStatesOrLabels = Object.keys(groupedJobs).sort();

  return (
    <div className={styles['c-board-section-wrapper']}>
      <div className={styles['c-board-section']}>
        {sortedStatesOrLabels.map(stateOrLabel => (
          <div key={stateOrLabel} className={styles['c-board-card-wrapper']}>
            <div className={styles['c-board-title-wrapper']}>
              <h3 className={styles['c-board-section-title']}>{stateOrLabel}</h3>
              <div className={styles['c-title-count']}>({groupedJobs[stateOrLabel].length})</div>
            </div>
            <div>
              {groupedJobs[stateOrLabel].map((job, index) => (
                <JobItem key={index} job={job} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobList;
