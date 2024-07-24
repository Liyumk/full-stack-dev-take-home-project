import type { HeatmapResponse } from '../types/heatmap.type';
import * as d3 from 'd3';

export const legendColors = ['#FFECE3', '#FBAB8F', '#FF7875', '#E6352B', '#800020'];

export function drawHeatmap(data: HeatmapResponse): void {
	if (!data.length) return;

	const margin = { top: 20, right: 20, bottom: 20, left: 40 };
	const width = 1200 - margin.left - margin.right;
	const height = 250 - margin.top - margin.bottom;

	d3.select('#heatmap').selectAll('svg').remove();

	const svg = d3
		.select('#heatmap')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', `translate(${margin.left},${margin.top})`);

	const x = d3
		.scaleBand<number>()
		.range([0, width])
		.domain(Array.from(new Set(data.map((d) => d.hour))))
		.padding(0.05);

	const y = d3
		.scaleBand<string>()
		.range([height, 0])
		.domain(Array.from(new Set(data.map((d) => d.country))))
		.padding(0.05);

	const colorScale = d3
		.scaleQuantize<string>()
		.domain([0, d3.max(data, (d) => d.uniqueVisitors) ?? 1])
		.range(legendColors);

	const circleRadius = 7.5;

	const xAxisGrid = d3.axisBottom(x).tickSize(-height).tickFormat('').ticks(x.domain().length);

	const yAxisGrid = d3.axisLeft(y).tickSize(-width).tickFormat('').ticks(y.domain().length);

	svg
		.append('g')
		.attr('class', 'x axis-grid')
		.attr('transform', `translate(0,${height})`)
		.call(xAxisGrid)
		.selectAll('line')
		.attr('stroke', '#F0EFEF')
		.attr('stroke-width', 1);

	svg
		.append('g')
		.attr('class', 'y axis-grid')
		.call(yAxisGrid)
		.selectAll('line')
		.attr('stroke', '#F0EFEF')
		.attr('stroke-width', 1);

	const tooltip = d3.select('#tooltip');

	svg
		.selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
		.attr('cx', (d) => x(d.hour)! + x.bandwidth() / 2)
		.attr('cy', (d) => y(d.country)! + y.bandwidth() / 2)
		.attr('r', circleRadius)
		.style('fill', (d) => (d.uniqueVisitors !== 0 ? colorScale(d.uniqueVisitors) : 'white'))
		.style('stroke', (d) => (d.uniqueVisitors !== 0 ? 'white' : '#F0F0F0'))
		.on('mouseover', function (event, d) {
			d3.select(this)
				.transition()
				.duration(200)
				.attr('r', circleRadius * 1.2)
				.style('stroke-width', 2)
				.style('stroke', '#000');

			tooltip
				.style('left', `${event.pageX + 10}px`)
				.style('top', `${event.pageY - 28}px`)
				.style('display', 'block').html(`
						<strong>Unique Visitors:</strong> ${d.uniqueVisitors}<br>
						<strong>Hour:</strong> ${d.hour}hr<br>
						<strong>Country:</strong> ${d.country}
					`);
		})
		.on('mousemove', function (event) {
			tooltip.style('left', `${event.pageX + 10}px`).style('top', `${event.pageY - 28}px`);
		})
		.on('mouseout', function () {
			d3.select(this)
				.transition()
				.duration(200)
				.attr('r', circleRadius)
				.style('stroke-width', 1)
				.style('stroke', (d) => (d.uniqueVisitors !== 0 ? 'white' : '#F0F0F0'));

			tooltip.style('display', 'none');
		});

	svg
		.append('g')
		.attr('transform', `translate(0,${height})`)
		.call(
			d3
				.axisBottom(x)
				.tickValues([1, 12, 24])
				.tickFormat((d) => `${d}hr`)
				.tickSize(0)
		);

	svg.append('g').call(d3.axisLeft(y).tickSize(0));

	svg.select('.x.axis-grid').selectAll('.domain').remove();
	svg.select('.y.axis-grid').selectAll('.domain').remove();
}
