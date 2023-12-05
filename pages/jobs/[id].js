import { useRouter } from 'next/router';
import JobDetails from '../../components/JobDetails';
import { fetchJobDetails } from '../../services/greenhouseApi';

const JobPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const jobDetails = fetchJobDetails(id); // Implement this in greenhouseApi.js

  return <JobDetails job={jobDetails} />;
};

export default JobPage;
