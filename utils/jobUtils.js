import _ from 'lodash';

const filterJobs = (jobs, filters) => {
  const filteredJobs = _.filter(jobs, (job) => {
    const { employment_type, team, department, office } = job;

    // Filter by employment type
    if (filters.employment_type && !_.includes(employment_type, filters.employment_type)) {
      return false;
    }

    // Filter by support type
    if (filters.support_type && !_.includes(getInSchoolDisplay(team?.value), filters.support_type)) {
      return false;
    }

    // Filter by department
    if (filters.department && !_.includes(department, filters.department)) {
      return false;
    }

    // Filter by office
    if (filters.office && !_.includes(office, filters.office)) {
      return false;
    }

    // If no filters are provided, return all jobs
    return true;
  });

  // Sort the jobs by date
  const sortedJobs = _.orderBy(filteredJobs, ['created_at'], ['desc']);

  return sortedJobs;
};

export { filterJobs };