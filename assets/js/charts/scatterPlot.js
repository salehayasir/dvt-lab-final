/**
 * Scatter Plot Component
 * Plots Funding Amount (X) vs Valuation (Y)
 * Size of bubble = Employees
 * Color = Industry
 */
class ScatterPlot {
    constructor(selector, data, onFilter) {
        this.selector = selector;
        this.originalData = data;
        this.data = data;
        this.onFilter = onFilter; // callback for cross-filtering

        // Setup dimensions
        this.margin = { top: 20, right: 30, bottom: 50, left: 60 };
        this.container = document.querySelector(selector);
        
        // Define color scale based on industries
        const industries = Array.from(new Set(data.map(d => d.industry)));
        this.colorScale = d3.scaleOrdinal()
            .domain(industries)
            .range(d3.schemeCategory10);

        this.init();
        this.update(data);
    }

    init() {
        // Create SVG
        this.width = this.container.clientWidth - this.margin.left - this.margin.right;
        this.height = this.container.clientHeight - this.margin.top - this.margin.bottom;

        this.svg = d3.select(this.selector)
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

        // Create Scales
        this.xScale = d3.scaleLinear().range([0, this.width]);
        this.yScale = d3.scaleLinear().range([this.height, 0]);
        this.rScale = d3.scaleSqrt().range([3, 20]); // Radius scale

        // Create Axes Groups
        this.xAxisGroup = this.svg.append("g")
            .attr("transform", `translate(0,${this.height})`);
        
        this.yAxisGroup = this.svg.append("g");

        // Labels
        this.svg.append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("x", this.width / 2)
            .attr("y", this.height + 40)
            .text("Funding Amount (M USD)");

        this.svg.append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", -45)
            .attr("x", -this.height / 2)
            .text("Valuation (M USD)");
            
        // Tooltip reference
        this.tooltip = d3.select("#tooltip");
    }

    update(newData) {
        this.data = newData;

        // Update scales domain
        this.xScale.domain([0, d3.max(this.data, d => d.fundingAmount) * 1.05]);
        this.yScale.domain([0, d3.max(this.data, d => d.valuation) * 1.05]);
        this.rScale.domain([0, d3.max(this.originalData, d => d.employees)]); // Keep radius relative to original

        // Update Axes with transition
        this.xAxisGroup.transition().duration(750).call(d3.axisBottom(this.xScale));
        this.yAxisGroup.transition().duration(750).call(d3.axisLeft(this.yScale));

        // Data join
        const circles = this.svg.selectAll("circle")
            .data(this.data, d => d.name);

        // Exit
        circles.exit()
            .transition().duration(500)
            .attr("r", 0)
            .remove();

        // Enter
        const circlesEnter = circles.enter()
            .append("circle")
            .attr("cx", d => this.xScale(d.fundingAmount))
            .attr("cy", d => this.yScale(d.valuation))
            .attr("r", 0)
            .attr("fill", d => this.colorScale(d.industry))
            .attr("opacity", 0.7)
            .attr("stroke", "#fff")
            .attr("stroke-width", 1);

        // Update & Enter merged
        circlesEnter.merge(circles)
            .on("mouseover", (event, d) => {
                d3.select(event.currentTarget).attr("stroke", "#000").attr("opacity", 1);
                this.tooltip.classed("hidden", false)
                    .html(`
                        <strong>${d.name}</strong><br/>
                        Industry: ${d.industry}<br/>
                        Funding: $${d.fundingAmount.toFixed(2)}M<br/>
                        Valuation: $${d.valuation.toFixed(2)}M<br/>
                        Employees: ${d.employees}
                    `)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", (event) => {
                d3.select(event.currentTarget).attr("stroke", "#fff").attr("opacity", 0.7);
                this.tooltip.classed("hidden", true);
            })
            .transition().duration(750)
            .attr("cx", d => this.xScale(d.fundingAmount))
            .attr("cy", d => this.yScale(d.valuation))
            .attr("r", d => this.rScale(d.employees));
    }
}