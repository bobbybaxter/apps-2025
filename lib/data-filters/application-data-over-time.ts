import type { Application } from '../../type';

export function getApplicationDataOverTime(applications: Application[]) {
  const allDates = new Set<string>();

  applications.forEach((app) => {
    if (app.applied && typeof app.applied === 'string') {
      allDates.add(app.applied);
    }
  });

  applications.forEach((app) => {
    if (app.out && typeof app.out === 'string') {
      allDates.add(app.out);
    }
  });

  const interviewFields = ['recruiterScreen', 'managerScreen', 'techInterview1', 'techInterview2', 'panel', 'ceo'];
  applications.forEach((app) => {
    interviewFields.forEach((field) => {
      if (app[field as keyof Application] && typeof app[field as keyof Application] === 'string') {
        allDates.add(String(app[field as keyof Application]));
      }
    });
  });

  const sortedAllDates = Array.from(allDates).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });
  const earliestAppliedDate = sortedAllDates[0];

  const chartAreaInteractiveData: Array<{
    date: string;
    applied: number;
    ghosted: number;
    notSelected: number;
    cancelled: number;
    applicationRescinded: number;
    offerRescinded: number;
    interviews: number;
  }> = [];

  if (earliestAppliedDate) {
    const startDate = new Date(earliestAppliedDate);
    const endDate = new Date(Math.max(...sortedAllDates.map((d) => new Date(d).getTime())));

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const year = currentDate.getFullYear();
      const dateStr = `${month}/${day}/${year}`;

      const applied = applications.filter((app) => app.applied === dateStr).length;

      const ghosted = applications.filter(
        (app) =>
          app.out === dateStr &&
          String(app.decision || '')
            .toLowerCase()
            .includes('ghosted'),
      ).length;

      const notSelected = applications.filter(
        (app) =>
          app.out === dateStr &&
          String(app.decision || '')
            .toLowerCase()
            .includes('not selected'),
      ).length;

      const cancelled = applications.filter(
        (app) =>
          app.out === dateStr &&
          String(app.decision || '')
            .toLowerCase()
            .includes('cancelled'),
      ).length;

      const applicationRescinded = applications.filter(
        (app) =>
          app.out === dateStr &&
          String(app.decision || '')
            .toLowerCase()
            .includes('application rescinded'),
      ).length;

      const offerRescinded = applications.filter(
        (app) =>
          app.out === dateStr &&
          String(app.decision || '')
            .toLowerCase()
            .includes('offer rescinded'),
      ).length;

      const interviews = applications.filter((app) => {
        return interviewFields.some((field) => app[field as keyof Application] === dateStr);
      }).length;

      chartAreaInteractiveData.push({
        date: dateStr,
        applied,
        ghosted,
        notSelected,
        cancelled,
        applicationRescinded,
        offerRescinded,
        interviews,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return chartAreaInteractiveData;
}
