/**
 * Profitability Analysis
 * Horizontal stacked bar chart showing profitable vs non-profitable by industry.
 */
class ProfitabilityChart {
    constructor(selector, data, onFilter) {
        this.selector = selector;
        this.originalData = data;
        this.onFilter = onFilter;

        this.margin = { top: 20, right: 30, bottom: 40, left: 120 };
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
        this.yScale = d3.scaleBand().range([this.height, 0]).padding(0.3);

        this.xAxisGroup = this.svg.append("g")
            .attr("transform", `translate(0,${this.height})`);
        
        this.yAxisGroup = this.svg.append("g");

        this.colorScale = d3.scaleOrdinal()
            .domain(["Profitable", "Non-Profitable"])
            .range(["#48bb78", "#f56565"]);

        this.svg.append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("x", this.width / 2)
            .attr("y", this.height + 35)
            .text("Count");

        this.tooltip = d3.select("#tooltip");
    }

    update(data) {
        // Group by industry and count profitable/non-profitable
        const grouped = d3.rollups(
            data,
            v => ({
                profitable: v.filter(d => d.isProfitable).length,
                nonProfitable: v.filter(d => !d.isProfitable).length
            }),
            d => d.industry
        ).map(([industry, counts]) => ({
            industry,
            Profitable: counts.profitable,
            "Non-Profitable": counts.nonProfitable
        })).sort((a, b) => (b.Profitable + b["Non-Profitable"]) - (a.Profitable + a["Non-Profitable"]));

        this.yScale.domain(grouped.map(d => d.industry));
        this.xScale.domain([0, d3.max(grouped, d => d.Profitable + d["Non-Profitable"])]);

        this.xAxisGroup.transition().duration(750).call(d3.axisBottom(this.xScale));
        this.yAxisGroup.transition().duration(750).call(d3.axisLeft(this.yScale));

        const bars = this.svg.selectAll("g.stack-group").data(grouped, d => d.industry);
        bars.exit().remove();

        const barsEnter = bars.enter().append("g").attr("class", "stack-group");

        barsEnter.merge(bars).selectAll("rect").remove();

        barsEnter.merge(bars).each((d, i, nodes) => {
            let x0 = 0;
            ["Profitable", "Non-Profitable"].forEach(key => {
                d3.select(nodes[i])
                    .append("rect")
                    .attr("x", x0)
                    .attr("y", this.yScale(d.industry))
                    .attr("width", this.xScale(d[key]))
                    .attr("height", this.yScale.bandwidth())
                    .attr("fill", this.colorScale(key))
                    .attr("cursor", "pointer")
                    .on("mouseover", (event) => {
                        d3.select(event.currentTarget).style("opacity", 0.8);
                        this.tooltip.classed("hidden", false)
                            .html(`<strong>${d.industry} - ${key}</strong><br/>${d[key]} startups`)
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 28) + "px");
                    })
                    .on("mouseout", (event) => {
                        d3.select(event.currentTarget).style("opacity", 1);
                        this.tooltip.classed("hidden", true);
                    });
                x0 += this.xScale(d[key]);
            });
        });
    }
}