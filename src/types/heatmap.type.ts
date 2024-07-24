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

export interface ElasticsearchResponse {
	took: number;
	timed_out: boolean;
	_shards: {
		total: number;
		successful: number;
		skipped?: number;
		failed: number;
	};
	hits: {
		total: {
			value: number;
			relation: string;
		};
		max_score: number | null;
		hits: [];
	};
	aggregations: {
		countries: {
			doc_count_error_upper_bound: number;
			sum_other_doc_count: number;
			buckets: Bucket[];
		};
	};
}

interface Bucket {
	key: string;
	doc_count: number;
	hours: {
		buckets: HourBucket[];
	};
}

interface HourBucket {
	key: number;
	doc_count: number;
	unique: {
		value: number;
	};
}

export type HeatmapResponse = {
	country: string;
	hour: number;
	uniqueVisitors: number;
}[];
