import React from 'react';
import { AreaClosed, Line, LinePath, Bar } from '@vx/shape';
import { curveMonotoneX } from '@vx/curve';
import { GridRows, GridColumns } from '@vx/grid';
import { scaleLinear } from '@vx/scale';
import { AxisBottom, AxisRight } from '@vx/axis';
import { withTooltip, Tooltip } from '@vx/tooltip';
import { localPoint } from '@vx/event';
import { GlyphDot } from '@vx/glyph';
import { bisector } from 'd3-array';

import FlowData from './data/statistics_flow.json';
const flow_st = FlowData;

// util
const min = (arr, fn) => Math.min(...arr.map(fn));
const max = (arr, fn) => Math.max(...arr.map(fn));
const extent = (arr, fn) => [min(arr, fn), max(arr, fn)];

// accessors
const x_st = d => d.flow;
const y_st = d => d.illegal;
const bisectDate = bisector(d => d.flow).left;

class Area extends React.Component {
  constructor(props) {
    super(props);
    this.handleTooltip = this.handleTooltip.bind(this);
  }
  handleTooltip({ event, data, x_st, xScale, yScale }) {
    const { showTooltip } = this.props;
    const { x } = localPoint(event);
    const x0 = xScale.invert(x);
    const index = bisectDate(data, x0, 1);
    const d0 = data[index - 1];
    const d1 = data[index];
    let d = d0;
    if (d1 && d1.flow) {
      d = x0 - x_st(d0.flow) > x_st(d1.flow) - x0 ? d1 : d0;
    }
    if (x0-Math.floor(x0)>0 && x0-Math.floor(x0)<0.5 && [15,30,45,60,75,90,105,120,135,150,165,180].includes(Math.floor(x0))) {
      showTooltip({
        tooltipData: d,
        tooltipLeft: x,
        tooltipTop: yScale(d.illegal)
      });
    }
  }
  render() {
    const {
      width=580,
      height=170,
      margin={
        top: 20,
        left: 20,
        right: 10,
        bottom: 40
      },
      hideTooltip,
      tooltipData,
      tooltipTop,
      tooltipLeft,
      events
    } = this.props;
    if (width < 10) return null;

    // bounds
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    // scales
    const xScale = scaleLinear({
      range: [0, xMax],
      domain: extent(flow_st, x_st),
      nice: true
    });
    const yScale = scaleLinear({
      range: [yMax, 0],
      domain: [0, max(flow_st, y_st) + yMax / 20],
      nice: true
    });

    // positions for glyphs
    const x = d => xScale(x_st(d));
    const y = d => yScale(y_st(d));

    return (
      <div>
        <svg ref={s => (this.svg = s)} width={width} height={height}>
          <rect x={0} y={0} width={width} height={height} opacity={0} />
          <defs>
            <linearGradient id="gradient_flow" x1="0%" y1="20%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(253, 128, 93)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="rgb(253, 128, 93)" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <GridRows
            lineStyle={{ pointerEvents: 'none' }}
            scale={yScale}
            width={xMax}
            strokeDasharray="2,2"
            stroke="rgba(255,255,255,0.1)"
            numTicks={5}
          />
          <GridColumns
            lineStyle={{ pointerEvents: 'none' }}
            scale={xScale}
            height={yMax}
            strokeDasharray="2,2"
            stroke="rgba(255,255,255,0.1)"
          />
          <AreaClosed
            data={flow_st}
            x={d => xScale(x_st(d))}
            y={d => yScale(y_st(d))}
            yScale={yScale}
            strokeWidth={0}
            stroke={'url(#gradient_flow)'}
            fill={'url(#gradient_flow)'}
            curve={curveMonotoneX}
          />
          <LinePath
            data={flow_st}
            x={d => xScale(x_st(d))}
            y={d => yScale(y_st(d))}
            stroke="rgba(255,255,255,0.4)"
            strokeWidth={1}
            curve={curveMonotoneX}
          />
          {flow_st.map((d, i) => {
            const cx = x(d);
            const cy = y(d);
            return (
              <g key={`line-point-${i}`}>
                <GlyphDot cx={cx} cy={cy} r={2} fill={'rgba(255, 255, 255, 0.1)'} stroke={'rgb(255, 255, 255)'} strokeWidth={1} />
              </g>
            );
          })}
          <Bar
            x={0}
            y={0}
            width={width}
            height={height}
            fill="transparent"
            rx={14}
            data={flow_st}
            onTouchStart={event =>
              this.handleTooltip({
                event,
                x_st,
                xScale,
                yScale,
                data: flow_st
              })
            }
            onTouchMove={event =>
              this.handleTooltip({
                event,
                x_st,
                xScale,
                yScale,
                data: flow_st
              })
            }
            onMouseMove={event =>
              this.handleTooltip({
                event,
                x_st,
                xScale,
                yScale,
                data: flow_st
              })
            }
            onMouseLeave={event => hideTooltip()}
          />
          <AxisBottom
            top={110}
            scale={xScale}
            stroke="#bcbaba"
            tickStroke="#bcbaba"
            label="Pedestrian Flow Rate (number of people per signal cycle)"
            labelProps={{
              fill: '#bcbaba',
              textAnchor: 'middle',
              fontSize: 11,
              fontFamily: 'Arial'
            }}
            tickStroke="#bcbaba"
            tickLength={7}
            tickLabelProps={(value, index) => ({
              fill: '#bcbaba',
              textAnchor: 'middle',
              fontSize: 10,
              fontFamily: 'Arial',
              dx: '-0.25em',
              dy: '0.25em'
            })}
          />
          <AxisRight
            top={margin.top-20}
            left={xMax}
            scale={yScale}
            hideZero
            hideAxisLine
            numTicks={5}
            stroke="#bcbaba"
            tickStroke="#bcbaba"
            tickLength={6}
            tickValues={[20,40,60,80]}
            tickLabelProps={(value, index) => ({
              fill: '#bcbaba',
              textAnchor: 'start',
              fontSize: 10,
              fontFamily: 'Arial',
              dx: '0.25em',
              dy: '0.25em'
            })}
          />
          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: 0 }}
                to={{ x: tooltipLeft, y: yMax }}
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth={2}
                style={{ pointerEvents: 'none' }}
                strokeDasharray="2,2"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={6}
                fill="rgba(255, 255, 255, 0.8)"
                strokeWidth={1}
                style={{ pointerEvents: 'none' }}
              />
            </g>
          )}
        </svg>
        {tooltipData && (
          <div>
            <Tooltip
              top={tooltipTop - 24}
              left={tooltipLeft + 12}
              style={{
                backgroundColor: 'rgb(117, 95, 90)',
                color: 'white'
              }}
            >
              {`${y_st(tooltipData)}% run the light`}
            </Tooltip>
            <Tooltip
              top={yMax}
              left={tooltipLeft}
              style={{
                transform: 'translateX(-50%)'
              }}
            >
              {`${x_st(tooltipData)} /100s`}
            </Tooltip>
          </div>
        )}
      </div>
    );
  }
}

export default withTooltip(Area);
