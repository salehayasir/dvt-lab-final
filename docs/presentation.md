# Presentation Support: Startup Ecosystem Dashboard

## 1. Presentation Outline
* **Slide 1: Title Slide** (Project Name, Course Name, Your Name)
* **Slide 2: Dataset Introduction** (Source, variables, why it was chosen)
* **Slide 3: Preprocessing & Cleaning** (Handling missing values, string-to-number casting)
* **Slide 4: Dashboard Architecture** (UI/UX principles, Grid layout, Color Scheme)
* **Slide 5: Visualization Choices** (Scatter Plot, Bar Chart, Line Chart, Donut Chart - and justifications)
* **Slide 6: Interactivity Details** (Brushing, Cross-filtering, Tooltips)
* **Slide 7: Live Demo** (Show the dashboard in action)
* **Slide 8: Conclusion & Q&A**

---

## 2. Viva Questions and Answers

**Q: Why did you choose a Scatter Plot for Funding vs. Valuation instead of a Bar Chart?**
*Answer:* Both variables are continuous numerical data. A scatter plot perfectly visualizes the correlation and density between two continuous variables, whereas a bar chart would be cluttered and fail to show individual data points properly.

**Q: How did you implement cross-filtering without using a library like crossfilter.js?**
*Answer:* I used an event-driven approach in `main.js`. I maintained a central `filters` state object. When an interaction occurs (like a click on the bar chart), a callback function updates the state, recalculates a filtered subset of the data using standard JavaScript `.filter()`, and calls `.update()` on all the chart instances.

**Q: What is "Brushing" in D3.js and how does your dashboard use it?**
*Answer:* Brushing is a D3 technique that allows users to click and drag to select a 1D or 2D region. In my Line Chart, I used `d3.brushX()` to let users select a specific time range (years), which dynamically filters the rest of the dashboard.

**Q: How did you handle data types when loading the CSV?**
*Answer:* `d3.csv` imports everything as strings. In the preprocessing module, I passed a row conversion function to `d3.csv` that used the unary plus operator (`+d["Variable"]`) to cast strings to numbers immediately upon loading.

**Q: What design principles from class did you incorporate?**
*Answer:* I focused on the "Data-Ink Ratio" by removing unnecessary grid lines and chart junk. I used appropriate color channels (Categorical scales for industries, distinct palette for regions) and ensured the layout was clean and balanced using CSS Grid.