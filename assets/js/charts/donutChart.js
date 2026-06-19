/**
 * Donut Chart Component
 * Shows distribution of startups by region.
 */
class DonutChart {
    constructor(selector, data, onFilter) {
        this.selector = selector;
        this.originalData = data;
        this.onFilter = onFilter;

        this.container = document.querySelector(selector);
        
        // Define color scale based on regions
        const regions = Array.from(new Set(data.map(d => d.region)));
        this.colorScale = d3.scaleOrdinal()
            .domain(regions)
            .range(d3.schemeSet3); // different color scheme to distinguish from industry

        this.init();
        this.update(data);
    }

    init() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.radius = Math.min(this.width, this.height) / 2 - 20;

        this.svg = d3.select(this.selector)
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .append("g")
            .attr("transform", `translate(${this.width / 2},${this.height / 2})`);

        this.pie = d3.pie()
            .value(d => d.count)
            .sort(null);

        this.arc = d3.arc()
            .innerRadius(this.radius * 0.5) // Makes it a donut
            .outerRadius(this.radius);

        this.tooltip = d3.select("#tooltip");
    }

    update(data) {
        const counts = d3.rollups(data, v => v.length, d => d.region)
            .map(([region, count]) => ({ region, count }));

        const pieData = this.pie(counts);
        const localArc = this.arc;

        const paths = this.svg.selectAll("path")
            .data(pieData, d => d.data.region);

        paths.exit().remove();

        const pathsEnter = paths.enter()
            .append("path")
            .attr("fill", d => this.colorScale(d.data.region))
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 0.8)
            .attr("cursor", "pointer")
            .attr("d", localArc);

        pathsEnter.merge(paths)
            .on("mouseover", (event, d) => {
                d3.select(event.currentTarget).style("opacity", 1);
                this.tooltip.classed("hidden", false)
                    .html(`<strong>${d.data.region}</strong><br/>${d.data.count} Startups`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", (event) => {
                d3.select(event.currentTarget).style("opacity", 0.8);
                this.tooltip.classed("hidden", true);
            })
            .transition().duration(750)
            .attrTween("d", function(d) {
                const interpolate = d3.interpolate(this._current || d, d);
                this._current = interpolate(0);
                return function(t) { return localArc(interpolate(t)); };
            });
    }
}