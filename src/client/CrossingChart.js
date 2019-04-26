import React from 'react';
import { AreaClosed, Line, LinePath, Bar } from '@vx/shape';
import { curveMonotoneX } from '@vx/curve';
import { GridRows, GridColumns } from '@vx/grid';
import { scaleLinear } from '@vx/scale';
import { AxisBottom } from '@vx/axis';
import { withTooltip, Tooltip } from '@vx/tooltip';
import { localPoint } from '@vx/event';
import { bisector } from 'd3-array';

// redux states management
import { connect } from 'react-redux';

// util
const min = (arr, fn) => Math.min(...arr.map(fn));
const max = (arr, fn) => Math.max(...arr.map(fn));
const extent = (arr, fn) => [min(arr, fn), max(arr, fn)];

// accessors
const xCrossing = d => d.second;
const yCrossing = d => d.crossings;
const bisectDate = bisector(d => d.second).left;

class Area extends React.Component {
  constructor(props) {
    super(props);
    this.handleTooltip = this.handleTooltip.bind(this);
  }

  getJSON(url) {
    var resp ;
    var xmlHttp ;
    resp  = '' ;
    xmlHttp = new XMLHttpRequest();
    if (xmlHttp != null) {
        xmlHttp.open( "GET", url, false );
        xmlHttp.send( null );
        resp = xmlHttp.responseText;
    }
    return resp ;
  }

  handleTooltip({ event, data, xCrossing, xScale, yScale }) {
    const { showTooltip } = this.props;
    const { x } = localPoint(event);
    const x0 = xScale.invert(x);
    const index = bisectDate(data, x0, 1);
    const d0 = data[index - 1];
    const d1 = data[index];
    let d = d0;
    if (d1 && d1.second) {
      d = x0 - xCrossing(d0.second) > xCrossing(d1.second) - x0 ? d1 : d0;
    }
    if (x0-Math.floor(x0)>0 && x0-Math.floor(x0)<0.3 && [6,10,14,18,22,26,30,34,38,42,46,50,54,58,62,66,70,74,78,82,86,90,94,98].includes(Math.floor(x0))) {
      showTooltip({
        tooltipData: d,
        tooltipLeft: x,
        tooltipTop: yScale(d.crossings)
      });
    }
  }
  render() {
    const {
      width=700,
      height=150,
      margin={
        top: 0,
        left: 0,
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

    const crossing = JSON.parse(this.getJSON(this.props.cross_url));

    // bounds
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    // scales
    const xScale = scaleLinear({
      range: [0, xMax],
      domain: extent(crossing, xCrossing),
      nice: true
    });
    const yScale = scaleLinear({
      range: [yMax, 0],
      domain: [0, max(crossing, yCrossing) + yMax / 20],
      nice: true
    });

    return (
      <div>
        <svg ref={s => (this.svg = s)} width={width} height={height}>
          <rect x={0} y={0} width={width} height={height} opacity={0} />
          <defs>
            <linearGradient id="gradient_cross" x1="74.9%" y1="0%" x2="75.1%" y2="0%">
              <stop offset="0%" stopColor="rgb(253, 128, 93)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="rgb(104, 90, 16)" stopOpacity={0.7} />
            </linearGradient>
            <linearGradient id="gradient_cover" x1="0%" y1="50%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(0, 0, 0)" stopOpacity={0} />
              <stop offset="100%" stopColor="rgb(0, 0, 0)" stopOpacity={0.6} />
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
            data={crossing}
            x={d => xScale(xCrossing(d))}
            y={d => yScale(yCrossing(d))}
            yScale={yScale}
            fill={'url(#gradient_cross)'}
            curve={curveMonotoneX}
          />
          <AreaClosed
            data={crossing}
            x={d => xScale(xCrossing(d))}
            y={d => yScale(yCrossing(d))}
            yScale={yScale}
            fill={'url(#gradient_cover)'}
            curve={curveMonotoneX}
          />
          <LinePath
            data={crossing}
            x={d => xScale(xCrossing(d))}
            y={d => yScale(yCrossing(d))}
            stroke="rgba(255,255,255,0.4)"
            strokeWidth={1}
            curve={curveMonotoneX}
          />
          <Bar
            x={0}
            y={0}
            width={width}
            height={height}
            fill="transparent"
            rx={14}
            data={crossing}
            onTouchStart={event =>
              this.handleTooltip({
                event,
                xCrossing,
                xScale,
                yScale,
                data: crossing
              })
            }
            onTouchMove={event =>
              this.handleTooltip({
                event,
                xCrossing,
                xScale,
                yScale,
                data: crossing
              })
            }
            onMouseMove={event =>
              this.handleTooltip({
                event,
                xCrossing,
                xScale,
                yScale,
                data: crossing
              })
            }
            onMouseLeave={event => hideTooltip()}
          />
          <Line
            from={{ x: 518, y: 30 }}
            to={{ x: 518, y: 130 }}
            stroke="rgba(247, 203, 190, 0.6)"
            strokeWidth={1}
            style={{ pointerEvents: 'none' }}
            strokeDasharray="2,2"
          />
          <AxisBottom
            top={110}
            scale={xScale}
            stroke="#bcbaba"
            tickStroke="#bcbaba"
            label="Time (sec.) within a Signal Cycle"
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
                fill="rgba(255, 255, 255, 0.3)"
                stroke="white"
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
              {yCrossing(tooltipData)==0||yCrossing(tooltipData)==1? `${yCrossing(tooltipData)} time`:`${yCrossing(tooltipData)} times`}
            </Tooltip>
            <Tooltip
              top={yMax}
              left={tooltipLeft}
              style={{
                transform: 'translateX(-50%)'
              }}
            >
              {`${xCrossing(tooltipData)-4}-${xCrossing(tooltipData)} sec.`}
            </Tooltip>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

export default connect(mapStateToProps)(withTooltip(Area));