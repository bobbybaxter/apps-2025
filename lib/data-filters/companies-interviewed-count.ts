import type { Application } from '../../type';

export function getCompaniesInterviewedCount(applications: Application[]) {
  return applications.filter(
    (application) =>
      application.recruiterScreen !== null ||
      application.managerScreen !== null ||
      application.techInterview1 !== null ||
      application.techInterview2 !== null ||
      application.panel !== null ||
      application.ceo !== null ||
      application.offer !== null,
  ).length;
}
