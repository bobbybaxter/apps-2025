import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getJobs } from '@/app/api/jobs/route';
import { ChartBarMixed } from '@/components/bar-chart-mixed';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import PieChartCard from '@/components/pie-chart-card';
import TopSectionCard from '@/components/top-section-card';
import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { type ChartConfig } from '@/components/ui/chart';
import { formatJobSearchDateString } from '@/lib/utils';

const jobSearchStartDate = new Date('2025-07-15');
const jobSearchDateString = formatJobSearchDateString(jobSearchStartDate);

const styles = {
  mainContainer: ['@container/main', 'flex', 'flex-col', 'gap-4', 'p-6'].join(' '),
  mainContainerContent: [
    'flex',
    'flex-row',
    'flex-wrap',
    'content-center',
    'gap-4',
    'md:gap-6',
    'justify-between',
  ].join(' '),
  mainBarCharts: [
    'flex',
    'flex-row',
    'flex-wrap',
    'content-center',
    'gap-4',
    'md:gap-6',
    '[&>*]:w-full',
    'min-[581px]:[&>*]:w-[calc(50%-8px)]',
    'min-[581px]:flex-nowrap',
    'md:[&>*]:w-[calc(50%-12px)]',
  ].join(' '),
};

const applicationChartConfig = {
  applications: {
    label: 'Applications',
    color: 'var(--color-blue-900)',
  },
  recruiterScreen: {
    label: 'Recruiter Screens',
    color: 'var(--color-blue-800)',
  },
  managerScreen: {
    label: 'Manager Screens',
    color: 'var(--color-blue-700)',
  },
  techInterview1: {
    label: 'Tech Interview 1',
    color: 'var(--color-blue-600)',
  },
  techInterview2: {
    label: 'Tech Interview 2',
    color: 'var(--color-blue-500)',
  },
  techInterviews: {
    label: 'Tech Interviews',
    color: 'var(--color-blue-600)',
  },
  panel: {
    label: 'Panels',
    color: 'var(--color-blue-400)',
  },
  ceo: {
    label: 'CEO Interviews',
    color: 'var(--color-blue-300)',
  },
  applied: {
    label: 'Applied',
    color: 'var(--color-blue-900)',
  },
  finalRounds: {
    label: 'Final Rounds',
    color: 'var(--color-blue-500)',
  },
  offer: {
    label: 'Offer',
    color: 'var(--color-blue-400)',
  },
  ghosted: {
    label: 'Ghosted',
    color: 'var(--color-blue-700)',
  },
  notSelected: {
    label: 'Not Selected',
    color: 'var(--color-blue-500)',
  },
  interviews: {
    label: 'Interviews',
    color: 'var(--color-blue-300)',
  },
  interviewing: {
    label: 'Interviewing',
    color: 'var(--color-blue-300)',
  },
  pending: {
    label: 'Pending',
    color: 'var(--color-blue-200)',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'var(--color-blue-600)',
  },
  applicationRescinded: {
    label: 'Application Rescinded',
    color: 'var(--color-blue-700)',
  },
  offerRescinded: {
    label: 'Offer Rescinded',
    color: 'var(--color-blue-800)',
  },
} satisfies ChartConfig;

export default async function Home() {
  const jobsData = await getJobs();

  return (
    <div className={styles.mainContainer}>
      <Card className="w-full">
        <CardHeader>
          <CardDescription className="p-2">
            <p>
              Welcome.
              <br />
              <br />
              I've been laid off for {jobSearchDateString}. During this time, job searching has become my full-time job.
              <br />
              <br />
              I've been asked by many interviewers what I've done with my "free time," so I've created this dashboard to
              better answer that question.
              <br />
              <br />
              Bob Baxter
            </p>
            <div className="flex flex-row gap-2">
              <a href="https://www.linkedin.com/in/bob-e-baxter/" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedin} size="xl" />
              </a>
              <a href="https://github.com/bobbybaxter" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faGithub} size="xl" />
              </a>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>

      <div className={styles.mainContainerContent}>
        <PieChartCard data={jobsData.applicationData} chartConfig={applicationChartConfig} title="Applications" />
        <TopSectionCard
          title="Companies Interviewed"
          value={jobsData.companiesInterviewedCount.toString()}
          footerText={`${jobsData.companiesInterviewedPercentage}% response rate`}
        />
        <TopSectionCard
          title="Total Interview Sessions"
          value={jobsData.applicationSessionsAmount.toString()}
          footerText={`Approx. ${jobsData.applicationSessionsTotalHours} hours spent interviewing`}
        />

        <TopSectionCard
          title="Company Ghost Rate"
          value={`${jobsData.companyGhostRate}%`}
          footerText={`${jobsData.companyGhostAmount} rejections without response`}
        />

        <TopSectionCard
          title="Estimated Hours Spent On Ghosted Applications"
          value={`${jobsData.companyGhostEstimatedHours} hours`}
          footerText={
            <>
              Avg time per job app is around 23 minutes{' '}
              <a
                href="https://www.linkedin.com/pulse/job-application-process-facts-figures-albert-robescu-ewq7e/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                (source)
              </a>
            </>
          }
        />

        <TopSectionCard
          title="Average Interview Cycle Length"
          value={`${jobsData.averageInterviewCycleLength} days`}
          footerText={`From app to interviews to rejection`}
        />

        <TopSectionCard
          title="Avg Auto-Rejection Response Time"
          value={`${jobsData.averageAutoRejectionResponseTime} days`}
          footerText={`From app to rejection with no interviews`}
        />

        <TopSectionCard
          title="Holiday Rejections"
          value={`${jobsData.holidayRejections}`}
          footerText={`Application rejections received on a holiday`}
        />
      </div>

      <ChartAreaInteractive data={jobsData.applicationDataOverTime} chartConfig={applicationChartConfig} />

      <div className={styles.mainBarCharts}>
        <ChartBarMixed
          data={jobsData.applicationSessions}
          chartConfig={applicationChartConfig}
          title="Interview Volume by Stage"
        />

        <ChartBarMixed
          data={jobsData.applicationSessionTimes}
          chartConfig={applicationChartConfig}
          title="Hours Per Interview Stage"
          tooltipSuffix="hours"
        />
      </div>
    </div>
  );
}
