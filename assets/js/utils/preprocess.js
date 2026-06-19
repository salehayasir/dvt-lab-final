/**
 * Data Preprocessing Module
 * This module is responsible for loading the CSV, casting strings to proper
 * numeric types, and handling any missing or anomalous data.
 */

const Preprocess = {
    /**
     * Loads and parses the dataset
     * @param {string} path - Path to the CSV file
     * @returns {Promise<Array>} - Resolves to an array of parsed objects
     */
    async loadData(path) {
        try {
            const data = await d3.csv(path, (d) => {
                // Ensure all numeric columns are cast appropriately
                return {
                    name: d["Startup Name"],
                    industry: d["Industry"],
                    region: d["Region"],
                    exitStatus: d["Exit Status"],
                    // Convert to numbers
                    fundingRounds: +d["Funding Rounds"] || 0,
                    fundingAmount: +d["Funding Amount (M USD)"] || 0,
                    valuation: +d["Valuation (M USD)"] || 0,
                    revenue: +d["Revenue (M USD)"] || 0,
                    employees: +d["Employees"] || 0,
                    marketShare: +d["Market Share (%)"] || 0,
                    yearFounded: +d["Year Founded"] || 0,
                    // Boolean parsing
                    isProfitable: d["Profitable"] === "1"
                };
            });

            // Filter out any completely invalid rows if necessary
            return data.filter(d => d.yearFounded > 0 && d.valuation >= 0);
            
        } catch (error) {
            console.error("Error loading data:", error);
            return [];
        }
    },

    /**
     * Calculate KPI aggregates for the dataset
     */
    calculateKPIs(data) {
        return {
            totalStartups: data.length,
            totalFunding: d3.sum(data, d => d.fundingAmount),
            avgValuation: d3.mean(data, d => d.valuation),
            profitableCount: data.filter(d => d.isProfitable).length
        };
    }
};
