import { useParams } from "react-router";
import { getCompany } from "../lib/graphql/queries";
import { useEffect, useState } from "react";
import JobList from "../components/JobList";

function CompanyPage() {
  const { companyId } = useParams();
  const [state, setState] = useState({
    company: null,
    loading: true,
    error: false,
  });
  useEffect(() => {
    (async () => {
      try {
        const company = await getCompany(companyId);
        setState({ company, loading: false, error: false });
      } catch (error) {
        setState({ company: null, error: true, loading: false });
      }
    })();
  }, [companyId]);
  const { loading, company, error } = state;
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <h2 className="has-text-danger">No such companies</h2>;
  }

  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
