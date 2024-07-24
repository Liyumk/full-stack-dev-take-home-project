import { DATE_RANGE } from '../types/heatmap.type';

export const dateRanges: Record<DATE_RANGE, string> = {
	[DATE_RANGE.LAST_WEEK]: 'Last week',
	[DATE_RANGE.LAST_TWO_WEEKS]: 'Last two weeks',
	[DATE_RANGE.LAST_MONTH]: 'Last month',
	[DATE_RANGE.LAST_QUARTER]: 'Last quarter',
	[DATE_RANGE.LAST_YEAR]: 'Last year'
};
