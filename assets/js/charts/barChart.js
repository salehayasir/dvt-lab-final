/**
 * Bar Chart Component
 * Shows count of startups by industry.
 * Acts as a filter when clicking on bars.
 */
class BarChart {
    constructor(selector, data, onFilter) {
        this.selector = selector;
        this.originalData = data;
        this.onFilter = onFilter;
        this.selectedIndustry = null;

        this.margin = { top: 20, right: 20, bottom: 60, left: 50 };
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

        this.xScale = d3.scaleBand().range([0, this.width]).padding(0.2);
        this.yScale = d3.scaleLinear().range([this.height, 0]);

        this.xAxisGroup = this.svg.append("g")
            .attr("transform", `translate(0,${this.height})`);
        
        this.yAxisGroup = this.svg.append("g");
        
        this.svg.append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", -35)
            .attr("x", -this.height / 2)
            .text("Count");
            
        this.tooltip = d3.select("#tooltip");
    }

    update(data) {
        // Rollup data to get counts per industry
        const counts = d3.rollups(data, v => v.length, d => d.industry)
            .map(([industry, count]) => ({ industry, count }))
            .sort((a, b) => b.count - a.count);

        this.xScale.domain(counts.map(d => d.industry));
        this.yScale.domain([0, d3.max(counts, d => d.count)]);

        this.xAxisGroup.transition().duration(750)
            .call(d3.axisBottom(this.xScale))
            .selectAll("text")
            .attr("transform", "rotate(-40)")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em");

        this.yAxisGroup.transition().duration(750)
            .call(d3.axisLeft(this.yScale).ticks(5));

        const bars = this.svg.selectAll(".bar")
            .data(counts, d => d.industry);

        bars.exit().transition().duration(500).attr("y", this.height).attr("height", 0).remove();

        const barsEnter = bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => this.xScale(d.industry))
            .attr("y", this.height)
            .attr("width", this.xScale.bandwidth())
            .attr("height", 0)
            .attr("fill", d => this.colorScale(d.industry))
            .attr("cursor", "pointer")
            .style("opacity", d => (this.selectedIndustry === null || this.selectedIndustry === d.industry) ? 1 : 0.4);

        barsEnter.merge(bars)
            .on("click", (event, d) => {
                // Toggle selection
                if (this.selectedIndustry === d.industry) {
                    this.selectedIndustry = null; // deselect
                } else {
                    this.selectedIndustry = d.industry; // select
                }
                
                // Update opacity visually
                this.svg.selectAll(".bar")
                    .style("opacity", b => (this.selectedIndustry === null || this.selectedIndustry === b.industry) ? 1 : 0.4);
                
                // Trigger filter callback
                this.onFilter('industry', this.selectedIndustry);
            })
            .on("mouseover", (event, d) => {
                d3.select(event.currentTarget).attr("stroke", "#000");
                this.tooltip.classed("hidden", false)
                    .html(`<strong>${d.industry}</strong>: ${d.count} Startups`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", (event) => {
                d3.select(event.currentTarget).attr("stroke", "none");
                this.tooltip.classed("hidden", true);
            })
            .transition().duration(750)
            .attr("x", d => this.xScale(d.industry))
            .attr("width", this.xScale.bandwidth())
            .attr("y", d => this.yScale(d.count))
            .attr("height", d => this.height - this.yScale(d.count))
            .style("opacity", d => (this.selectedIndustry === null || this.selectedIndustry === d.industry) ? 1 : 0.4);
    }
}