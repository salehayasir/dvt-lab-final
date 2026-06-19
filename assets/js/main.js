/**
 * Main Application Logic
 * Coordinates data loading, chart initialization, and cross-filtering.
 */
document.addEventListener("DOMContentLoaded", async () => {
    // 1. Load Data
    const dataset = await Preprocess.loadData("assets/datasets/startup_data.csv");
    
    if (dataset.length === 0) {
        document.querySelector(".dashboard-container").innerHTML = "<h2>Error: Could not load data. Check console.</h2>";
        return;
    }

    // 2. State Management for Cross-Filtering
    let filters = {
        industry: null,
        // we can add year range, region later
    };

    let charts = {};

    // 3. Filter Application Logic
    const applyFilters = () => {
        let filteredData = dataset;

        if (filters.industry) {
            filteredData = filteredData.filter(d => d.industry === filters.industry);
        }
        if (filters.yearRange) {
            filteredData = filteredData.filter(d => 
                d.yearFounded >= filters.yearRange[0] && 
                d.yearFounded <= filters.yearRange[1]
            );
        }

        // Update KPIs
        updateKPIs(filteredData);

        // Update all charts
        Object.values(charts).forEach(chart => {
            if (chart instanceof BarChart || chart instanceof LineChart) {
                // These charts should keep showing all categories/years even when filtered
                chart.update(dataset);
            } else {
                chart.update(filteredData);
            }
        });
    };

    // Callback when a chart requests a filter
    const onFilterChange = (filterKey, value) => {
        filters[filterKey] = value;
        applyFilters();
    };

    // 4. Initialize KPIs
    const updateKPIs = (data) => {
        const kpis = Preprocess.calculateKPIs(data);
        
        // Format functions
        const formatNum = d3.format(",.0f");
        const formatCurrency = d3.format("$,.1f");

        document.getElementById("kpi-total").innerText = formatNum(kpis.totalStartups);
        document.getElementById("kpi-funding").innerText = formatCurrency(kpis.totalFunding);
        document.getElementById("kpi-valuation").innerText = formatCurrency(kpis.avgValuation);
        document.getElementById("kpi-profitable").innerText = formatNum(kpis.profitableCount);
    };

    // 5. Initialize Charts
    charts.scatter = new ScatterPlot("#scatter-plot", dataset, onFilterChange);
    charts.bar = new BarChart("#bar-chart", dataset, onFilterChange);
    charts.line = new LineChart("#line-chart", dataset, onFilterChange);
    charts.donut = new DonutChart("#donut-chart", dataset, onFilterChange);
    charts.revenueScatter = new RevenueScatterPlot("#revenue-scatter", dataset, onFilterChange);
    charts.exitStatus = new ExitStatusChart("#exit-status", dataset, onFilterChange);
    charts.profitability = new ProfitabilityChart("#profitability-chart", dataset, onFilterChange);
    charts.fundingRounds = new FundingRoundsChart("#funding-rounds", dataset, onFilterChange);

    // Initial KPI render
    updateKPIs(dataset);
    
    // Handle Window Resize (responsive charts)
    window.addEventListener("resize", () => {
        // To be fully robust, we would destroy and recreate or update SVG dimensions.
        // For now, reload page or implement responsive resize methods on classes.
    });
});