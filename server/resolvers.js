import { GraphQLError } from "graphql";
import {
  getJobs,
  getJob,
  getJobsByCompanyId,
  createJob,
  deleteJob,
  updateJob,
  countJobs,
} from "./db/jobs.js";
import { getCompany } from "./db/companies.js";

export const resolvers = {
  Query: {
    jobs: async (_root, { limit, offset }) => {
      const items = await getJobs(limit, offset);
      const totalCount = await countJobs();
      return { items, totalCount };
    },
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if (!job) {
        throw new notFoundError("No job found with id" + id);
      }
      return job;
    },
    company: async (_root, { id }) => {
      const company = await getCompany(id);
      if (!company) {
        throw new notFoundError("No company found with id" + id);
      }
      return company;
    },
  },
  Mutation: {
    createJob: async (_root, { input: { title, description } }, { user }) => {
      console.log(user);
      if (!user) {
        throw new authError("Unauthorized");
      }
      return createJob({ companyId: user.companyId, title, description });
    },
    deleteJob: async (_root, { id }, { user }) => {
      if (!user) {
        throw new authError("Unauthorized");
      }
      const job = await deleteJob(id, user.companyId);
      if (!job) {
        throw new notFoundError("No job found with id" + id);
      }
      return job;
    },
    updateJob: async (
      _root,
      { input: { id, title, description } },
      { user }
    ) => {
      if (!user) {
        throw new authError("Unauthorized");
      }
      const job = updateJob({
        id,
        title,
        description,
        companyId: user.companyId,
      });
      return job;
    },
  },
  Company: {
    jobs: (company) => getJobsByCompanyId(company.id),
  },
  Job: {
    company: (job, _args, { companyLoader }) =>
      companyLoader.load(job.companyId),
    date: (job) => toIsoDate(job.createdAt),
  },
};

function notFoundError(message) {
  return new GraphQLError(message, {
    extensions: {
      code: "NOT_FOUND",
    },
  });
}

function authError(message) {
  return new GraphQLError(message, {
    extensions: {
      code: "AUTHORIZATION_ERROE",
    },
  });
}

function toIsoDate(value) {
  return value.slice(0, "yyyy-mm-dd".length);
}
