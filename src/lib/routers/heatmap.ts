import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { Client } from '@elastic/elasticsearch';
import { aggregateData } from '../../utils/transformResponseToDataPoints';

const t = initTRPC.create();

const client = new Client({
	cloud: {
		id: import.meta.env.VITE_ELASTIC_SEARCH_CLOUD_ID
	},
	auth: {
		apiKey: import.meta.env.VITE_ELASTIC_SEARCH_API_KEY
	}
});

const dateRangeSchema = z.enum([
	'last_week',
	'last_two_weeks',
	'last_month',
	'last_quarter',
	'last_year'
]);

const getDateRange = (
	range: 'last_week' | 'last_two_weeks' | 'last_month' | 'last_quarter' | 'last_year'
) => {
	const now = new Date();
	let gteDate: Date;

	switch (range) {
		case 'last_week':
			gteDate = new Date(now.setDate(now.getDate() - 7));
			break;
		case 'last_two_weeks':
			gteDate = new Date(now.setDate(now.getDate() - 14));
			break;
		case 'last_month':
			gteDate = new Date(now.setMonth(now.getMonth() - 1));
			break;
		case 'last_quarter':
			gteDate = new Date(now.setMonth(now.getMonth() - 3));
			break;
		case 'last_year':
			gteDate = new Date(now.setFullYear(now.getFullYear() - 1, 0, 2));
			break;
		default:
			gteDate = new Date(now.setDate(now.getDate() - 7));
	}

	return { gte: gteDate.toISOString() };
};

interface HourBucket {
	key: string;
	unique: {
		value: number;
	};
}

interface CountryBucket {
	key: string;
	hours: {
		buckets: HourBucket[];
	};
}

interface Aggregations {
	countries: {
		buckets: CountryBucket[];
	};
}

export const heatmapRouter = t.router({
	getHeatmapData: t.procedure
		.input(
			z.object({
				dateRange: dateRangeSchema
			})
		)
		.query(async ({ input }) => {
			const { dateRange } = input;
			const { gte: startDate } = getDateRange(dateRange);
			console.log('start date: ', startDate);

			const specificCountryCodes = [
				'CN',
				'IN',
				'US',
				'ID',
				'BR',
				'BD',
				'NG',
				'JP',
				'EG',
				'CO',
				'TR'
			];

			const response = await client.search({
				index: import.meta.env.VITE_ELASTIC_SEARCH_INDEX,
				body: {
					query: {
						bool: {
							filter: [
								{
									range: {
										'@timestamp': {
											gte: startDate,
											lte: new Date().toISOString()
										}
									}
								},
								{
									terms: {
										'geo.dest': specificCountryCodes
									}
								}
							]
						}
					},
					aggs: {
						by_country: {
							terms: {
								field: 'geo.dest',
								size: 11
							},
							aggs: {
								hourly_agg: {
									date_histogram: {
										field: '@timestamp',
										fixed_interval: '1h'
									},
									aggs: {
										unique_visitors: {
											cardinality: {
												field: 'id'
											}
										}
									}
								}
							}
						}
					},
					size: 0
				}
			});

			return aggregateData(response);
		})
});
