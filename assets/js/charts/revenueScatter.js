/**
 * Revenue vs Employees Scatter Plot
 * Alternative view comparing operational scale to financial performance.
 * Size reflects Funding Amount.
 */
class RevenueScatterPlot {
    constructor(selector, data, onFilter) {
        this.selector = selector;
        this.originalData = data;
        this.data = data;
        this.onFilter = onFilter;

        this.margin = { top: 20, right: 30, bottom: 50, left: 60 };
        this.container = document.querySelector(selector);

        const industries = Array.from(new Set(data.map(d => d.industry)));
        this.colorScale = d3.scaleOrdinal()
            .domain(industries)
            .range(d3.schemeCategory10);

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
        this.rScale = d3.scaleSqrt().range([3, 18]);

        this.xAxisGroup = this.svg.append("g")
            .attr("transform", `translate(0,${this.height})`);
        
        this.yAxisGroup = this.svg.append("g");

        this.svg.append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("x", this.width / 2)
            .attr("y", this.height + 40)
            .text("Employees");

        this.svg.append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", -45)
            .attr("x", -this.height / 2)
            .text("Revenue (M USD)");

        this.tooltip = d3.select("#tooltip");
    }

    update(newData) {
        this.data = newData;

        this.xScale.domain([0, d3.max(this.data, d => d.employees) * 1.05]);
        this.yScale.domain([0, d3.max(this.data, d => d.revenue) * 1.05]);
        this.rScale.domain([0, d3.max(this.originalData, d => d.fundingAmount)]);

        this.xAxisGroup.transition().duration(750).call(d3.axisBottom(this.xScale));
        this.yAxisGroup.transition().duration(750).call(d3.axisLeft(this.yScale));

        const circles = this.svg.selectAll("circle").data(this.data, d => d.name);

        circles.exit().transition().duration(500).attr("r", 0).remove();

        circles.enter()
            .append("circle")
            .attr("cx", d => this.xScale(d.employees))
            .attr("cy", d => this.yScale(d.revenue))
            .attr("r", 0)
            .attr("fill", d => this.colorScale(d.industry))
            .attr("opacity", 0.7)
            .attr("stroke", "#fff")
            .attr("stroke-width", 1)
            .merge(circles)
            .on("mouseover", (event, d) => {
                d3.select(event.currentTarget).attr("stroke", "#000").attr("opacity", 1);
                this.tooltip.classed("hidden", false)
                    .html(`<strong>${d.name}</strong><br/>Employees: ${d.employees}<br/>Revenue: $${d.revenue.toFixed(2)}M`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", (event) => {
                d3.select(event.currentTarget).attr("stroke", "#fff").attr("opacity", 0.7);
                this.tooltip.classed("hidden", true);
            })
            .transition().duration(750)
            .attr("cx", d => this.xScale(d.employees))
            .attr("cy", d => this.yScale(d.revenue))
            .attr("r", d => this.rScale(d.fundingAmount));
    }
}