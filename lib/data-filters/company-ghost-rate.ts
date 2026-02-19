import type { Application } from '../../type';

export function getCompanyGhostRate(applications: Application[]): {
  companyGhostAmount: number;
  companyGhostRate: number;
  companyGhostEstimatedHours: number;
} {
  const ghostedApplications = applications.filter((application) =>
    String(application.decision || '')
      .toLowerCase()
      .includes('ghosted'),
  );
  const totalDeniedApplications = applications.filter((application) => application.out !== null);

  const companyGhostRate = (ghostedApplications.length / totalDeniedApplications.length) * 100;

  const interviewTimeFields = [
    'recruiterScreenTime',
    'managerScreenTime',
    'techInterview1Time',
    'techInterview2Time',
    'panelTime',
    'ceoTime',
  ] as const;

  const interviewMinutes = ghostedApplications.reduce((total, app) => {
    for (const field of interviewTimeFields) {
      const value = app[field];
      if (value) {
        total += parseFloat(value) || 0;
      }
    }
    return total;
  }, 0);

  const applicationMinutes = ghostedApplications.length * 23;

  return {
    companyGhostAmount: ghostedApplications.length,
    companyGhostRate: Number(companyGhostRate.toFixed(2)),
    companyGhostEstimatedHours: Math.round((applicationMinutes + interviewMinutes) / 60),
  };
}
