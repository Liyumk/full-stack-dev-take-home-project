import type { HeatmapResponse } from '../types/heatmap.type';
import type { ElasticsearchResponse } from '../types/heatmap.type';

export function aggregateData(response: ElasticsearchResponse): HeatmapResponse {
	const buckets = response.aggregations.countries.buckets;

	return buckets.flatMap((bucket) => {
		const allHours = Array.from({ length: 24 }, (_, i) => ({
			hour: i + 1,
			uniqueVisitors: 0
		}));

		bucket.hours.buckets.forEach((hourBucket) => {
			const hourIndex = hourBucket.key;
			allHours[hourIndex] = {
				hour: hourBucket.key + 1,
				uniqueVisitors: hourBucket.unique.value
			};
		});

		return allHours.map((hourData) => ({
			country: bucket.key,
			hour: hourData.hour,
			uniqueVisitors: hourData.uniqueVisitors
		}));
	});
}
