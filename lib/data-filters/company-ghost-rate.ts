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
  return {
    companyGhostAmount: ghostedApplications.length,
    companyGhostRate: Number(companyGhostRate.toFixed(2)),
    companyGhostEstimatedHours: Math.round((ghostedApplications.length * 23) / 60),
  };
}
