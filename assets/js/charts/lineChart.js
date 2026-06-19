/**
 * Line/Area Chart Component
 * Shows number of startups founded per year.
 * Includes D3 Brush for temporal filtering.
 */
class LineChart {
    constructor(selector, data, onFilter) {
        this.selector = selector;
        this.originalData = data;
        this.onFilter = onFilter;

        this.margin = { top: 20, right: 30, bottom: 40, left: 50 };
        this.container = document.querySelector(selector);

        this.init();
        this.update(data);
    }

    init() {
        this.width = this.container.clientWidth - this.margin.left - this.margin.right;
        this.height = this.container.clientHeight - this.margin.top - this.margin.bottom;

        this.svg = d3.select(this.selector)
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

        this.xScale = d3.scaleLinear().range([0, this.width]);
        this.yScale = d3.scaleLinear().range([this.height, 0]);

        this.xAxisGroup = this.svg.append("g")
            .attr("transform", `translate(0,${this.height})`);
        
        this.yAxisGroup = this.svg.append("g");

        // Area Generator
        this.area = d3.area()
            .x(d => this.xScale(d.year))
            .y0(this.height)
            .y1(d => this.yScale(d.count))
            .curve(d3.curveMonotoneX);

        this.areaPath = this.svg.append("path")
            .attr("class", "area-path")
            .attr("fill", "var(--accent-color)")
            .attr("opacity", 0.4);

        this.line = d3.line()
            .x(d => this.xScale(d.year))
            .y(d => this.yScale(d.count))
            .curve(d3.curveMonotoneX);

        this.linePath = this.svg.append("path")
            .attr("class", "line-path")
            .attr("fill", "none")
            .attr("stroke", "var(--accent-color)")
            .attr("stroke-width", 3);

        // Brushing
        this.brush = d3.brushX()
            .extent([[0, 0], [this.width, this.height]])
            .on("end", this.brushed.bind(this));

        this.svg.append("g")
            .attr("class", "brush")
            .call(this.brush);
    }

    brushed(event) {
        if (!event.selection) {
            // Brush cleared
            this.onFilter('yearRange', null);
            return;
        }
        // selection contains the pixel boundaries [x0, x1]
        const [x0, x1] = event.selection;
        const year0 = Math.round(this.xScale.invert(x0));
        const year1 = Math.round(this.xScale.invert(x1));

        this.onFilter('yearRange', [year0, year1]);
    }

    update(data) {
        // Rollup data by year
        const counts = d3.rollups(data, v => v.length, d => d.yearFounded)
            .map(([year, count]) => ({ year, count }))
            .sort((a, b) => a.year - b.year);

        if (counts.length === 0) return;

        // Static domain so the chart axes don't jump around when filtering from other charts
        // Or dynamic, but static x-axis is usually better for time.
        this.xScale.domain(d3.extent(this.originalData, d => d.yearFounded));
        this.yScale.domain([0, d3.max(counts, d => d.count) * 1.1]);

        this.xAxisGroup.transition().duration(750).call(d3.axisBottom(this.xScale).tickFormat(d3.format("d")));
        this.yAxisGroup.transition().duration(750).call(d3.axisLeft(this.yScale));

        this.areaPath
            .datum(counts)
            .transition().duration(750)
            .attr("d", this.area);

        this.linePath
            .datum(counts)
            .transition().duration(750)
            .attr("d", this.line);
    }
}