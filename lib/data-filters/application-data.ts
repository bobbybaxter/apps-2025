import type { Application } from '../../type';

export function getApplicationData(applications: Application[]) {
  return [
    {
      label: 'Pending',
      value: applications.filter((application) => application.decision === null).length,
      fill: 'var(--color-pending)',
    },
    {
      label: 'Interviewing',
      value: applications.filter((application) => String(application.decision).includes('interviewing')).length,
      fill: 'var(--color-interviewing)',
    },
    {
      label: 'Not Selected',
      value: applications.filter((application) => String(application.decision).includes('not selected')).length,
      fill: 'var(--color-notSelected)',
    },
    {
      label: 'Ghosted',
      value: applications.filter((application) => String(application.decision).includes('ghosted')).length,
      fill: 'var(--color-ghosted)',
    },
    {
      label: 'Cancelled',
      value: applications.filter((application) => String(application.decision).includes('cancelled')).length,
      fill: 'var(--color-cancelled)',
    },
    {
      label: 'Application Rescinded',
      value: applications.filter((application) => String(application.decision).includes('application rescinded'))
        .length,
      fill: 'var(--color-applicationRescinded)',
    },
    {
      label: 'Offer Rescinded',
      value: applications.filter((application) => String(application.decision).includes('offer rescinded')).length,
      fill: 'var(--color-offerRescinded)',
    },
  ];
}
