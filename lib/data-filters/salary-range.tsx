import type { Application } from '../../type';

type SalaryRange = {
  name: string;
  min: number;
  lowerQuartile: number;
  median: number;
  upperQuartile: number;
  max: number;
  average: number;
};

function parseSalary(salary: string | null | undefined): number | null {
  if (!salary || salary.trim() === '') return null;

  const cleaned = salary.replace(/[$,\s]/g, '');
  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? null : parsed;
}

function calculateQuartile(sortedValues: number[], quartile: number): number {
  if (sortedValues.length === 0) return 0;

  const index = (sortedValues.length - 1) * quartile;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;

  if (lower === upper) {
    return sortedValues[lower];
  }

  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
}

function trimOutliers(values: number[], trimPercentage: number = 0.05): number[] {
  if (values.length === 0) return values;

  const sorted = [...values].sort((a, b) => a - b);
  const trimCount = Math.floor(sorted.length * trimPercentage);

  if (trimCount === 0) return sorted;

  return sorted.slice(trimCount, sorted.length - trimCount);
}

export function getSalaryRanges(applications: Application[]): {
  salaryRanges: SalaryRange[];
  salaryRangePercentage: number;
} {
  const levels = ['Senior', 'Mid-level', 'Junior'];
  const salaryRanges: SalaryRange[] = [];

  const applicationsWithSalary = applications.filter((app) => {
    const min = parseSalary(app.payMin);
    const max = parseSalary(app.payMax);
    return min !== null && max !== null && min > 0 && max > 0 && max >= min;
  });

  const salaryRangePercentage =
    applications.length > 0 ? Number(((applicationsWithSalary.length / applications.length) * 100).toFixed(2)) : 0;

  for (const level of levels) {
    const levelApplications = applicationsWithSalary.filter((app) => app.level === level);

    if (levelApplications.length === 0) {
      salaryRanges.push({
        name: level,
        min: 0,
        lowerQuartile: 0,
        median: 0,
        upperQuartile: 0,
        max: 0,
        average: 0,
      });
      continue;
    }

    const midpoints: number[] = [];
    const allMins: number[] = [];
    const allMaxs: number[] = [];

    for (const app of levelApplications) {
      const min = parseSalary(app.payMin)!;
      const max = parseSalary(app.payMax)!;
      const midpoint = (min + max) / 2;

      midpoints.push(midpoint);
      allMins.push(min);
      allMaxs.push(max);
    }

    // Remove outliers (top and bottom 5% by default)
    const trimmedMidpoints = trimOutliers(midpoints);
    const trimmedMins = trimOutliers(allMins);
    const trimmedMaxs = trimOutliers(allMaxs);

    const sortedMidpoints = trimmedMidpoints;

    const min = trimmedMins.length > 0 ? Math.min(...trimmedMins) : 0;
    const max = trimmedMaxs.length > 0 ? Math.max(...trimmedMaxs) : 0;
    const lowerQuartile = calculateQuartile(sortedMidpoints, 0.25);
    const median = calculateQuartile(sortedMidpoints, 0.5);
    const upperQuartile = calculateQuartile(sortedMidpoints, 0.75);
    const average =
      trimmedMidpoints.length > 0 ? trimmedMidpoints.reduce((sum, val) => sum + val, 0) / trimmedMidpoints.length : 0;

    salaryRanges.push({
      name: level,
      min: Math.round(min),
      lowerQuartile: Math.round(lowerQuartile),
      median: Math.round(median),
      upperQuartile: Math.round(upperQuartile),
      max: Math.round(max),
      average: Math.round(average),
    });
  }

  return {
    salaryRanges,
    salaryRangePercentage,
  };
}
