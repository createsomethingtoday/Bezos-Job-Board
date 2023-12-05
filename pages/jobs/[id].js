import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import JobDetails from '../../components/JobDetails';
import { fetchJobDetails } from '../../services/greenhouseApi';

const JobPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchJobDetails(id)
        .then(data => {
          setJobDetails(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError('Failed to fetch job details');
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <JobDetails job={jobDetails} />;
};

export default JobPage;
