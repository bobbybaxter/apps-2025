import type { Application } from '../../type';

export function getHolidayRejections(applications: Application[]) {
  const holidayDates = [
    '09/01/2025',
    '10/13/2025',
    '11/11/2025',
    '11/27/2025',
    '12/25/2025',
    '01/01/2026',
    '01/19/2026',
    '02/16/2026',
    '05/25/2026',
    '07/04/2026',
    '09/07/2026',
    '10/12/2026',
    '11/26/2026',
    '12/25/2026',
  ];

  const holidayRejections = applications.filter((application) => {
    const applicationDate = new Date(application.out);
    return holidayDates.includes(applicationDate.toLocaleDateString());
  });

  return holidayRejections.length;
}
