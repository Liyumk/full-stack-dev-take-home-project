type Bucket = {
	key_as_string: string;
	doc_count: number;
};

type HourlyAgg = {
	buckets: Bucket[];
};

type CountryBucket = {
	key: string;
	doc_count: number;
	hourly_agg: HourlyAgg;
};

type AggregationResponse = {
	aggregations: {
		by_country: {
			buckets: CountryBucket[];
		};
	};
};

type DataPoint = {
	country: string;
	hour: number;
	value: number;
};

const getHour = (dateString: string): number => new Date(dateString).getUTCHours() + 1; // 1-based hour

export const aggregateData = (response: AggregationResponse): DataPoint[] => {
	const dataPoints: DataPoint[] = [];

	response.aggregations.by_country.buckets.forEach(({ key: country, hourly_agg: { buckets } }) => {
		const hourlyData: Record<number, number> = buckets.reduce(
			(acc, { key_as_string, doc_count }) => {
				const hour = getHour(key_as_string);
				acc[hour] = (acc[hour] || 0) + doc_count;
				return acc;
			},
			{} as Record<number, number>
		);

		for (const [hour, value] of Object.entries(hourlyData)) {
			dataPoints.push({ country, hour: parseInt(hour, 10), value });
		}
	});

	return dataPoints.sort((a, b) => (a.country > b.country ? -1 : 1));
};
