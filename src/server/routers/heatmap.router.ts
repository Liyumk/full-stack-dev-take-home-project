import { HeatmapService } from '../services/heatmap.service';
import { createTRPCRouter, publicProcedure } from '../trpcContext';
import { heatmapParamsSchema } from '../validations/heatmap.schema';

export const heatmapRouter = createTRPCRouter({
	getHeatmapData: publicProcedure.input(heatmapParamsSchema).query(({ input }) => {
		return new HeatmapService().getHeatmapData(input);
	})
});
