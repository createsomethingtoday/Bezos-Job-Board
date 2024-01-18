import JobItem from './JobItem';
import styles from './JobList.module.css'; // Import the styles from JobList.module.css

function JobList({ jobs }) {
  // Function to extract the city name or use 'Multiple'/'Remote'
  const getCityOrLabel = (locationName) => {
    if (!locationName || locationName === "Multiple" || locationName === "Remote") {
      return locationName;
    }
    const parts = locationName.split(',').map(part => part.trim());
    return parts[1]; // Return the city name or the first part
  };

  // Function to group jobs by city or label
  const groupJobsByCityOrLabel = (jobs) => {
    const grouped = {};
    jobs.forEach(job => {
      const cityOrLabel = getCityOrLabel(job.location.name);
      if (!grouped[cityOrLabel]) {
        grouped[cityOrLabel] = [];
      }
      grouped[cityOrLabel].push(job);
    });
    return grouped;
  };

  // Group and sort jobs by city or label
  const groupedJobs = groupJobsByCityOrLabel(jobs);
  const sortedCityOrLabels = Object.keys(groupedJobs).sort();

  return (
    <div className={styles['c-board-wrapper']}>
      {sortedCityOrLabels.map(cityOrLabel => (
        <div key={cityOrLabel} className={styles['c-board-section-wrapper']}>
          {/* Apply the title wrapper class directly to the h3 element */}
          <h3 className={styles['c-board-title-wrapper']}>{cityOrLabel}</h3>
          <div className={styles['c-board-card-wrapper']}>
            {groupedJobs[cityOrLabel].map((job, index) => (
              <JobItem key={index} job={job} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default JobList;
