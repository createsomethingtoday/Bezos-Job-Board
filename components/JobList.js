// components/JobList.js

function JobList({ jobs }) {
    return (
        <div>
            <h2>Job Listings</h2>
            <ul>
                {jobs.map((job, index) => (
                    <li key={index}>
                        <h3>{job.title}</h3>
                        <p><strong>Location:</strong> {job.location.name}</p>
                        <p><strong>Updated At:</strong> {job.updated_at}</p>
                        <p><strong>Department:</strong> {job.departments.map(dept => dept.name).join(', ')}</p>
                        <p><strong>Office:</strong> {job.offices.map(office => office.name).join(', ')}</p>
                        <a href={job.absolute_url} target="_blank" rel="noopener noreferrer">View Job Details</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default JobList;
