import type { HeatmapResponse } from '../../types/heatmap.type';
import { Client } from '@elastic/elasticsearch';
import type { HeatmapParams } from '../validations/heatmap.schema';
import { aggregateData } from '../../utils/aggregateData';
import type { ElasticsearchResponse } from '../../types/heatmap.type';

export class HeatmapService {
	private client: Client;

	constructor() {
		this.client = new Client({
			cloud: { id: import.meta.env.VITE_ELASTIC_SEARCH_CLOUD_ID },
			auth: { apiKey: import.meta.env.VITE_ELASTIC_SEARCH_API_KEY }
		});
	}

	async getHeatmapData(params: HeatmapParams): Promise<HeatmapResponse> {
		const { dateRange } = params;
		const { gte: startDate } = this.getDateRange(dateRange);
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
			'TR',
			'PK'
		];

		const response = await this.client.search({
			index: import.meta.env.VITE_ELASTIC_SEARCH_INDEX,
			query: {
				bool: {
					must: [
						{
							range: {
								'@timestamp': {
									gte: startDate,
									lte: new Date().toISOString(),
									format: 'strict_date_optional_time'
								}
							}
						},
						{ terms: { 'geo.dest': specificCountryCodes } }
					],
					filter: [],
					should: [],
					must_not: []
				}
			},
			aggs: {
				countries: {
					terms: {
						field: 'geo.dest'
						// size: 1
					},
					aggs: {
						hours: {
							histogram: {
								field: 'hour_of_day',
								interval: 1
							},
							aggs: {
								unique: {
									cardinality: {
										field: 'clientip'
									}
								}
							}
						}
					}
				}
			},
			size: 0,
			runtime_mappings: {
				hour_of_day: {
					type: 'long',
					script: {
						source: "emit(doc['@timestamp'].value.getHour());"
					}
				}
			}
		});

		return aggregateData(response as ElasticsearchResponse);
	}

	private getDateRange(
		range: 'last_week' | 'last_two_weeks' | 'last_month' | 'last_quarter' | 'last_year'
	) {
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
	}
}
