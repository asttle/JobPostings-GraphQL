import { useParams } from "react-router";
import { getCompanyByIdQuery } from "../lib/graphql/queries";
import JobList from "../components/JobList";
import { useQuery } from "@apollo/client";

function CompanyPage() {
  const { companyId } = useParams();
  const { data, loading, error } = useQuery(getCompanyByIdQuery, {
    variables: { id: companyId },
  });
  const { company } = data;
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
