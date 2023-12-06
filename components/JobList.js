import JobItem from './JobItem';

function JobList({ jobs }) {
  return (
    <div className="c-board-wrapper">
      {jobs.map((job, index) => (
        <JobItem key={index} job={job} />
      ))}
    </div>
  );
}

export default JobList;
