import { useMutation, useQuery } from "@apollo/client";
import {
  createJobMutationQuery,
  getCompanyByIdQuery,
  jobByIdQuery,
  jobsQuery,
} from "./queries";

export function useCompany(id) {
  const { data, loading, error } = useQuery(getCompanyByIdQuery, {
    variables: { id },
  });
  return { company: data?.company, loading, error: Boolean(error) };
}

export function useJob(id) {
  const { data, loading, error } = useQuery(jobByIdQuery, {
    variables: { id },
  });
  return { job: data?.job, loading, error: Boolean(error) };
}

export function useJobs() {
  const { data, loading, error } = useQuery(jobsQuery, {
    fetchPolicy: "network-only",
  });
  return { jobs: data?.jobs, loading, error: Boolean(error) };
}

export function useCreateJob() {
  const [mutate, { loading, error }] = useMutation(createJobMutationQuery);

  const createJob = async (title, description) => {
    const {
      data: { job },
    } = await mutate({
      variables: {
        input: { title, description },
      },
      update: (cache, { data }) => {
        cache.writeQuery({
          query: jobByIdQuery,
          variables: { id: data.job.id },
          data,
        });
      },
    });
    return job;
  };

  return { createJob, loading, error: Boolean(error) };
}
