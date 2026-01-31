import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import {
  getApplicationData,
  getApplicationDataOverTime,
  getApplicationSessions,
  getAverageAutoRejectionResponseTime,
  getAverageInterviewCycleLength,
  getCompaniesInterviewedCount,
  getCompanyGhostRate,
  getHolidayRejections,
  parseGoogleSheet,
} from '@/lib/data-filters';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive.file'];

export async function getJobs() {
  if (!process.env.CLIENT_EMAIL || !process.env.PRIVATE_KEY) {
    throw new Error('Missing required environment variables: CLIENT_EMAIL and PRIVATE_KEY');
  }

  const jwt = new JWT({
    email: process.env.CLIENT_EMAIL,
    key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: SCOPES,
  });

  const doc = new GoogleSpreadsheet('1BLfXhhFbRxI71j-65Fi74WJxgA77iC2LMf0pMzCsNwY', jwt);
  await doc.loadInfo();

  const applications = await parseGoogleSheet(doc);
  const companiesInterviewedCount = getCompaniesInterviewedCount(applications);
  const { applicationSessions, applicationSessionsAmount, applicationSessionTimes, totalHours } =
    getApplicationSessions(applications);
  const { companyGhostAmount, companyGhostRate, companyGhostEstimatedHours } = getCompanyGhostRate(applications);
  const averageInterviewCycleLength = getAverageInterviewCycleLength(applications);
  const averageAutoRejectionResponseTime = getAverageAutoRejectionResponseTime(applications);
  const holidayRejections = getHolidayRejections(applications);

  const compiledData = {
    applications,
    applicationData: getApplicationData(applications),
    applicationDataOverTime: getApplicationDataOverTime(applications),
    applicationSessions,
    applicationSessionsAmount,
    applicationSessionTimes,
    applicationSessionsTotalHours: totalHours,
    averageAutoRejectionResponseTime,
    averageInterviewCycleLength,
    companiesInterviewedCount,
    companiesInterviewedPercentage: ((companiesInterviewedCount / applications.length) * 100).toFixed(2),
    companyGhostAmount,
    companyGhostEstimatedHours,
    companyGhostRate,
    holidayRejections,
  };

  return compiledData;
}

export async function GET() {
  const data = await getJobs();
  return Response.json({ data });
}
