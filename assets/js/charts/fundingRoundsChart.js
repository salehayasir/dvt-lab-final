/**
 * Funding Rounds Distribution
 * Histogram showing the distribution of startups by number of funding rounds.
 */
class FundingRoundsChart {
    constructor(selector, data, onFilter) {
        this.selector = selector;
        this.originalData = data;
        this.onFilter = onFilter;

        this.margin = { top: 20, right: 30, bottom: 50, left: 50 };
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

        this.xScale = d3.scaleBand().range([0, this.width]).padding(0.1);
        this.yScale = d3.scaleLinear().range([this.height, 0]);

        this.xAxisGroup = this.svg.append("g")
            .attr("transform", `translate(0,${this.height})`);
        
        this.yAxisGroup = this.svg.append("g");

        this.svg.append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("x", this.width / 2)
            .attr("y", this.height + 40)
            .text("Funding Rounds");

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
        // Create histogram bins
        const bins = d3.rollups(data, v => v.length, d => d.fundingRounds)
            .map(([rounds, count]) => ({ rounds: rounds.toString(), count }))
            .sort((a, b) => parseInt(a.rounds) - parseInt(b.rounds));

        this.xScale.domain(bins.map(d => d.rounds));
        this.yScale.domain([0, d3.max(bins, d => d.count) * 1.1]);

        this.xAxisGroup.transition().duration(750).call(d3.axisBottom(this.xScale));
        this.yAxisGroup.transition().duration(750).call(d3.axisLeft(this.yScale).ticks(5));

        const bars = this.svg.selectAll(".funding-bar").data(bins, d => d.rounds);
        bars.exit().transition().duration(500).attr("y", this.height).attr("height", 0).remove();

        bars.enter()
            .append("rect")
            .attr("class", "funding-bar")
            .attr("x", d => this.xScale(d.rounds))
            .attr("y", this.height)
            .attr("width", this.xScale.bandwidth())
            .attr("height", 0)
            .attr("fill", "#667eea")
            .attr("cursor", "pointer")
            .merge(bars)
            .on("mouseover", (event, d) => {
                d3.select(event.currentTarget).attr("fill", "#5a67d8");
                this.tooltip.classed("hidden", false)
                    .html(`<strong>${d.rounds} Rounds</strong><br/>${d.count} startups`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", (event) => {
                d3.select(event.currentTarget).attr("fill", "#667eea");
                this.tooltip.classed("hidden", true);
            })
            .transition().duration(750)
            .attr("x", d => this.xScale(d.rounds))
            .attr("width", this.xScale.bandwidth())
            .attr("y", d => this.yScale(d.count))
            .attr("height", d => this.height - this.yScale(d.count));
    }
}