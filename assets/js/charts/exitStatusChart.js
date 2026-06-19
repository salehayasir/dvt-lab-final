/**
 * Exit Status Distribution
 * Pie chart showing breakdown of Private vs Acquired startups.
 */
class ExitStatusChart {
    constructor(selector, data, onFilter) {
        this.selector = selector;
        this.originalData = data;
        this.onFilter = onFilter;

        this.container = document.querySelector(selector);
        const statuses = Array.from(new Set(data.map(d => d.exitStatus)));
        this.colorScale = d3.scaleOrdinal()
            .domain(statuses)
            .range(["#4299e1", "#48bb78", "#ed8936"]); // Blue, Green, Orange

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

        this.pie = d3.pie().value(d => d.count).sort(null);
        this.arc = d3.arc().outerRadius(this.radius);

        this.tooltip = d3.select("#tooltip");
    }

    update(data) {
        const counts = d3.rollups(data, v => v.length, d => d.exitStatus)
            .map(([status, count]) => ({ status, count }));

        const pieData = this.pie(counts);
        const localArc = this.arc;

        const paths = this.svg.selectAll("path")
            .data(pieData, d => d.data.status);

        paths.exit().remove();

        const pathsEnter = paths.enter()
            .append("path")
            .attr("fill", d => this.colorScale(d.data.status))
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .attr("cursor", "pointer")
            .attr("d", localArc);

        pathsEnter.merge(paths)
            .on("mouseover", (event, d) => {
                d3.select(event.currentTarget).style("opacity", 0.7);
                const percentage = ((d.data.count / data.length) * 100).toFixed(1);
                this.tooltip.classed("hidden", false)
                    .html(`<strong>${d.data.status}</strong><br/>${d.data.count} (${percentage}%)`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", (event) => {
                d3.select(event.currentTarget).style("opacity", 1);
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