import { z } from 'zod';

export const heatmapParamsSchema = z.object({
	dateRange: z.enum(['last_week', 'last_two_weeks', 'last_month', 'last_quarter', 'last_year'])
});

export type HeatmapParams = z.infer<typeof heatmapParamsSchema>;
