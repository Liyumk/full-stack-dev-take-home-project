export type DateRange =
	| 'last_week'
	| 'last_two_weeks'
	| 'last_month'
	| 'last_quarter'
	| 'last_year';

export enum DATE_RANGE {
	LAST_WEEK = 'last_week',
	LAST_TWO_WEEKS = 'last_two_weeks',
	LAST_MONTH = 'last_month',
	LAST_QUARTER = 'last_quarter',
	LAST_YEAR = 'last_year'
}
