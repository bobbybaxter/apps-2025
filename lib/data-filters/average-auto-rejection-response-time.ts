import type { Application } from '../../type';

export function getAverageAutoRejectionResponseTime(applications: Application[]) {
  const applicationsWithNoInterviews = applications.filter(
    (application) =>
      application.recruiterScreen === null &&
      application.managerScreen === null &&
      application.techInterview1 === null &&
      application.techInterview2 === null &&
      application.panel === null &&
      application.ceo === null,
  );

  const validApplications = applicationsWithNoInterviews.filter((application) => {
    if (!application.out || !application.applied) return false;

    const outDate = new Date(application.out);
    const appliedDate = new Date(application.applied);

    if (isNaN(outDate.getTime()) || isNaN(appliedDate.getTime())) return false;

    return outDate >= appliedDate;
  });

  if (validApplications.length === 0) {
    return 0;
  }

  const totalDays = validApplications.reduce((acc, application) => {
    const outDate = new Date(application.out);
    const appliedDate = new Date(application.applied);
    const diffInMs = outDate.getTime() - appliedDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24); // Convert milliseconds to days
    return acc + diffInDays;
  }, 0);

  const averageAutoRejectionResponseTime = totalDays / validApplications.length;

  return averageAutoRejectionResponseTime.toFixed(0);
}
