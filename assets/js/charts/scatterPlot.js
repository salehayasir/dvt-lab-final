/**
 * Scatter Plot Component
 * Funding Amount (X) vs Valuation (Y)
 * Size = Employees
 * Color = Industry
 */
class ScatterPlot {
    constructor(selector, data, onFilter) {
        this.selector = selector;
        this.originalData = data;
        this.data = data;
        this.onFilter = onFilter;

        this.margin = { top: 20, right: 180, bottom: 50, left: 60 }; 
        // extra right margin for legends

        this.container = document.querySelector(selector);

        // Color scale (Industry)
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

        // Scales
        this.xScale = d3.scaleLinear().range([0, this.width]);
        this.yScale = d3.scaleLinear().range([this.height, 0]);
        this.rScale = d3.scaleSqrt().range([3, 20]);

        // Axes
        this.xAxisGroup = this.svg.append("g")
            .attr("transform", `translate(0,${this.height})`);

        this.yAxisGroup = this.svg.append("g");

        // Axis Labels
        this.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", this.width / 2)
            .attr("y", this.height + 40)
            .text("Funding Amount (M USD)");

        this.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -this.height / 2)
            .attr("y", -45)
            .text("Valuation (M USD)");

        // Tooltip
        this.tooltip = d3.select("#tooltip");

        // Legends
        this.drawLegends();
    }

    drawLegends() {
        const legendX = this.width + 20;

        // -----------------------
        // Industry Legend
        // -----------------------
        const legend = this.svg.append("g")
            .attr("transform", `translate(${legendX}, 20)`);

        legend.append("text")
            .attr("y", -10)
            .style("font-weight", "bold")
            .text("Industry");

        this.colorScale.domain().forEach((industry, i) => {
            const row = legend.append("g")
                .attr("transform", `translate(0, ${i * 20})`);

            row.append("rect")
                .attr("width", 12)
                .attr("height", 12)
                .attr("fill", this.colorScale(industry));

            row.append("text")
                .attr("x", 18)
                .attr("y", 10)
                .style("font-size", "12px")
                .text(industry);
        });

        // -----------------------
        // Bubble Size Legend
        // -----------------------
        const sizeLegend = this.svg.append("g")
            .attr("transform", `translate(${legendX}, 260)`);

        sizeLegend.append("text")
            .attr("y", -10)
            .style("font-weight", "bold")
            .text("Employees");

        const sizeValues = [100, 500, 1000];

        sizeValues.forEach((value, i) => {
            const r = this.rScale(value);

            sizeLegend.append("circle")
                .attr("cx", 20)
                .attr("cy", i * 50)
                .attr("r", r)
                .attr("fill", "#999")
                .attr("opacity", 0.5);

            sizeLegend.append("text")
                .attr("x", 50)
                .attr("y", i * 50 + 5)
                .style("font-size", "11px")
                .text(`${value} employees`);
        });
    }

    update(newData) {
        this.data = newData;

        this.xScale.domain([0, d3.max(this.data, d => d.fundingAmount) * 1.05]);
        this.yScale.domain([0, d3.max(this.data, d => d.valuation) * 1.05]);
        this.rScale.domain([0, d3.max(this.originalData, d => d.employees)]);

        this.xAxisGroup.transition().duration(750)
            .call(d3.axisBottom(this.xScale));

        this.yAxisGroup.transition().duration(750)
            .call(d3.axisLeft(this.yScale));

        const circles = this.svg.selectAll("circle.data-point")
            .data(this.data, d => d.name);

        circles.exit()
            .transition().duration(500)
            .attr("r", 0)
            .remove();

        const circlesEnter = circles.enter()
            .append("circle")
            .attr("class", "data-point")
            .attr("cx", d => this.xScale(d.fundingAmount))
            .attr("cy", d => this.yScale(d.valuation))
            .attr("r", 0)
            .attr("fill", d => this.colorScale(d.industry))
            .attr("opacity", 0.7)
            .attr("stroke", "#fff")
            .attr("stroke-width", 1);

        circlesEnter.merge(circles)
            .on("mouseover", (event, d) => {
                d3.select(event.currentTarget)
                    .attr("stroke", "#000")
                    .attr("opacity", 1);

                this.tooltip.classed("hidden", false)
                    .html(`
                        <strong>${d.name}</strong><br/>
                        Industry: ${d.industry}<br/>
                        Region: ${d.region}<br/>
                        Funding: $${d.fundingAmount.toFixed(2)}M<br/>
                        Valuation: $${d.valuation.toFixed(2)}M<br/>
                        Employees: ${d.employees}<br/>
                        Exit Status: ${d.exitStatus}<br/>
                        Profitable: ${d.profitable ? "Yes" : "No"}
                    `)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", (event) => {
                d3.select(event.currentTarget)
                    .attr("stroke", "#fff")
                    .attr("opacity", 0.7);

                this.tooltip.classed("hidden", true);
            })
            .transition().duration(750)
            .attr("cx", d => this.xScale(d.fundingAmount))
            .attr("cy", d => this.yScale(d.valuation))
            .attr("r", d => this.rScale(d.employees));
    }
}