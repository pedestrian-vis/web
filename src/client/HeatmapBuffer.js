import React from 'react';
import { Group } from '@vx/group';
import { scaleLinear } from '@vx/scale';
import { HeatmapRect } from '@vx/heatmap';
import { withTooltip, Tooltip } from '@vx/tooltip';
import HeatmapData from './data/utilization_buf.json';

const hot1 = 'rgb(29, 29, 29)';
const hot2 = 'rgb(252, 160, 40)';
const data = HeatmapData;

// utils
const max = (data, value = d => d) => Math.max(...data.map(value));
const min = (data, value = d => d) => Math.min(...data.map(value));

// accessors
const bins = d => d.bins;
const count = d => d.count;

const colorMax = max(data, d => max(bins(d), count));
const bucketSizeMax = max(data, d => bins(d).length);

// scales
const xScale = scaleLinear({
  domain: [0, data.length]
});
const yScale = scaleLinear({
  domain: [0, bucketSizeMax]
});
const rectColorScale = scaleLinear({
  range: [hot1, hot2],
  domain: [0, colorMax]
});
const opacityScale = scaleLinear({
  range: [1.0, 1.0],
  domain: [0, colorMax]
});

export default ({
  width = 58,
  height = 366,
  margin = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 30
  }
}) => {
  // bounds
  let size = width;
  if (size > margin.left + margin.right) {
    size = width - margin.left - margin.right;
  }

  const xMax = size;
  const yMax = height - margin.bottom - margin.top;

  const binWidth = xMax / data.length;
  const binHeight = yMax / bucketSizeMax;
  const radius = min([binWidth, binHeight]) / 2;

  xScale.range([0, xMax]);
  yScale.range([yMax, 0]);

  return (
    <svg width={width} height={height}>
      <rect x={0} y={0} width={width} height={height} rx={14} opacity={0} />
      <Group top={margin.top} left={margin.left}>
        <HeatmapRect
          data={data}
          xScale={xScale}
          yScale={yScale}
          colorScale={rectColorScale}
          opacityScale={opacityScale}
          binWidth={binWidth}
          binHeight={binWidth}
          gap={3.5}
        >
          {heatmap => {
            return heatmap.map(bins => {
              return bins.map(bin => {
                return (
                  <rect
                    key={`heatmap-rect-${bin.row}-${bin.column}`}
                    className="vx-heatmap-rect"
                    width={bin.width}
                    height={bin.height}
                    x={bin.x}
                    y={bin.y}
                    fill={bin.color}
                    fillOpacity={bin.opacity}
                    onClick={event => {
                      const { row, column } = bin;
                      alert(JSON.stringify({ row, column, ...bin.bin }));
                    }}
                  />
                );
              });
            });
          }}
        </HeatmapRect>
      </Group>
    </svg>
  );
};