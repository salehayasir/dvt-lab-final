# Startup Ecosystem Dashboard

A comprehensive, interactive web-based dashboard built with **D3.js** for the Data Visualization Techniques course.

## 🚀 Quick Links

- **Comprehensive Report:** `/docs/comprehensive-report.md` (26KB, detailed explanations)
- **Presentation Guide:** `/docs/ppt-guide.md` (13-slide structure with speaker notes)
- **Documentation Template:** `/docs/documentation-template.md` (Guide to create your own project doc)

---

## 📊 Dashboard Overview

### 8 Interactive Visualizations

1. **Funding vs. Valuation** (Scatter Plot) - Bubble size = Employees, Color = Industry
2. **Startups by Industry** (Bar Chart) - Clickable for cross-filtering
3. **Revenue vs Employees** (Scatter Plot) - Analyze productivity metrics
4. **Founded Over Time** (Line Chart) - Timeline with D3 Brush filtering
5. **Exit Status Distribution** (Pie Chart) - Private vs Acquired breakdown
6. **Distribution by Region** (Donut Chart) - Geographic headquarters
7. **Profitability by Industry** (Stacked Bar) - Profitable vs non-profitable
8. **Funding Rounds Distribution** (Histogram) - Funding activity patterns

### Key Features

✅ **Cross-Filtering:** Click industry bars or brush timeline to filter all charts  
✅ **Interactive Tooltips:** Hover over data points for exact values  
✅ **Responsive Design:** Works on desktop, tablet, and mobile  
✅ **Real-time KPIs:** Dynamic metric updates based on selected data  
✅ **Smooth Animations:** 750ms D3.js transitions for visual feedback  

---

## 📈 Dataset

- **Records:** 100+ startups
- **Key Variables:** Funding, Valuation, Revenue, Employees, Industry, Region, Year Founded, Exit Status
- **Time Period:** 1995–2006
- **Regions:** Europe, South America, Asia

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **HTML5** | Document structure |
| **CSS3** | Responsive Grid layout, styling |
| **JavaScript (ES6+)** | Data processing, logic |
| **D3.js v7** | Data visualizations |
| **Git & GitHub** | Version control |
| **GitHub Pages** | Deployment |

---

## 🚀 Local Development

### Prerequisites
- Modern web browser
- Python 3 or Node.js (for local server)

### Quick Start

```bash
# Start local server
python -m http.server 8000
# Or: npx http-server

# Open browser
# http://localhost:8000
```

---

## 📤 GitHub Pages Deployment

### One-Time Setup

```bash
git init
git add .
git commit -m "Initial commit: Startup Ecosystem Dashboard"
git remote add origin https://github.com/YOUR_USERNAME/startup-dashboard.git
git branch -M main
git push -u origin main
```

### Enable GitHub Pages

1. Go to Settings → Pages
2. Select **main** branch, **/ (root)** folder
3. Click Save
4. Wait 1-2 minutes
5. Live at: `https://YOUR_USERNAME.github.io/startup-dashboard/`

**Detailed guide:** See `/docs/comprehensive-report.md` Section 12

---

## 📚 Documentation

### comprehensive-report.md (26KB)
Complete technical documentation:
- Project overview & objectives
- Dataset analysis with insights
- Data preprocessing strategies
- Dashboard architecture & design
- Detailed visualization justification
- Interactivity mechanisms
- D3.js concepts
- Challenges & solutions
- GitHub Pages deployment
- Future enhancements

### ppt-guide.md (15KB)
PowerPoint presentation template:
- 13-slide outline
- Speaker notes for each slide
- Viva questions & answers (10 Q&A pairs)
- Presentation tips
- Materials checklist

### documentation-template.md (15KB)
Guide to write your own project report:
- 14-chapter structure template
- Writing style guide
- Chapter-by-chapter templates
- Formatting recommendations
- Document checklist
- Sample sections

---

## 🏗️ Project Structure

```
project/
├── index.html                    # Main file
├── assets/
│   ├── css/style.css            # Styling
│   ├── js/
│   │   ├── main.js              # Application logic
│   │   ├── utils/preprocess.js  # Data loading
│   │   └── charts/              # 8 chart components
│   └── datasets/startup_data.csv
├── docs/
│   ├── comprehensive-report.md   # Full documentation
│   ├── ppt-guide.md              # Presentation guide
│   └── documentation-template.md # Report template
└── README.md
```

---

## 💡 Next Steps

1. **Run Locally:** `python -m http.server 8000`
2. **Read Docs:** Start with `comprehensive-report.md`
3. **Create Presentation:** Use `ppt-guide.md` template
4. **Deploy:** Follow GitHub Pages setup above
5. **Write Report:** Use `documentation-template.md`

---

## 🎯 Learning Outcomes

✅ D3.js data visualization  
✅ Responsive web design (CSS Grid)  
✅ Modern JavaScript (ES6+, OOP)  
✅ Interactive design patterns  
✅ Full-stack deployment  

---

**Version:** 1.0 | **Status:** Production Ready ✅
