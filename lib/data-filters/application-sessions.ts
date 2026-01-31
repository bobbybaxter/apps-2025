import type { Application } from '../../type';

export function getApplicationSessions(applications: Application[]) {
  const sessionLabels = {
    recruiterScreen: 'Recruiter Screens',
    managerScreen: 'Manager Screens',
    techInterviews: 'Tech Interviews',
    panel: 'Panels',
    ceo: 'CEO Interviews',
  };

  const sessionTypes = ['recruiterScreen', 'managerScreen', 'techInterview1', 'techInterview2', 'panel', 'ceo'];
  const timeFieldMap: Record<string, keyof Application> = {
    recruiterScreen: 'recruiterScreenTime',
    managerScreen: 'managerScreenTime',
    techInterview1: 'techInterview1Time',
    techInterview2: 'techInterview2Time',
    panel: 'panelTime',
    ceo: 'ceoTime',
  };

  const sessionTypeMinutes: Record<string, number> = {};
  let totalMinutes = 0;
  let totalSessionsCount = 0;

  const applicationsCount = applications.length;
  const recruiterScreensCount = applications.filter(
    (app) => app.recruiterScreen !== null && app.recruiterScreen !== undefined && app.recruiterScreen !== '',
  ).length;
  const managerScreensCount = applications.filter(
    (app) => app.managerScreen !== null && app.managerScreen !== undefined && app.managerScreen !== '',
  ).length;
  const techInterviewsCount = applications.filter(
    (app) =>
      (app.techInterview1 !== null && app.techInterview1 !== undefined && app.techInterview1 !== '') ||
      (app.techInterview2 !== null && app.techInterview2 !== undefined && app.techInterview2 !== ''),
  ).length;
  const finalRoundsCount = applications.filter(
    (app) =>
      (app.panel !== null && app.panel !== undefined && app.panel !== '') ||
      (app.ceo !== null && app.ceo !== undefined && app.ceo !== ''),
  ).length;
  const offersCount = applications.filter(
    (app) => app.offer !== null && app.offer !== undefined && app.offer !== '',
  ).length;

  for (const application of applications) {
    for (const sessionType of sessionTypes) {
      if (
        application[sessionType as keyof Application] !== null &&
        application[sessionType as keyof Application] !== undefined &&
        application[sessionType as keyof Application] !== ''
      ) {
        totalSessionsCount++;
        const timeField = timeFieldMap[sessionType];
        const timeValue = application[timeField] as string | null;
        const timeMinutes = timeValue ? parseFloat(timeValue) || 0 : 0;
        totalMinutes += timeMinutes;

        const aggregatedType =
          sessionType === 'techInterview1' || sessionType === 'techInterview2' ? 'techInterviews' : sessionType;

        if (!sessionTypeMinutes[aggregatedType]) {
          sessionTypeMinutes[aggregatedType] = 0;
        }
        sessionTypeMinutes[aggregatedType] += timeMinutes;
      }
    }
  }

  const displayTypes = ['recruiterScreen', 'managerScreen', 'techInterviews', 'panel', 'ceo'];
  const applicationSessionTimes = displayTypes
    .filter((type) => sessionTypeMinutes[type] && sessionTypeMinutes[type] > 0)
    .map((type) => {
      return {
        name: sessionLabels[type as keyof typeof sessionLabels],
        value: Math.round(sessionTypeMinutes[type] / 60),
        fill: `var(--color-${type})`,
      };
    });

  const totalHours = Math.ceil(totalMinutes / 60);

  const applicationSessions = [
    { name: 'Applications', value: applicationsCount, fill: 'var(--color-blue-900)' },
    { name: 'Recruiter Screens', value: recruiterScreensCount, fill: 'var(--color-blue-800)' },
    { name: 'Manager Screens', value: managerScreensCount, fill: 'var(--color-blue-700)' },
    { name: 'Tech Interviews', value: techInterviewsCount, fill: 'var(--color-blue-600)' },
    { name: 'Final Rounds', value: finalRoundsCount, fill: 'var(--color-blue-500)' },
    { name: 'Offers', value: offersCount, fill: 'var(--color-blue-400)' },
  ];

  return {
    applicationSessions,
    applicationSessionsAmount: totalSessionsCount,
    applicationSessionTimes,
    totalHours,
  };
}
