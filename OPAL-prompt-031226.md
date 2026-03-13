


Here is a complete and comprehensive response to your request. 

First, I have designed the **Reusable Meta-Prompt** you asked for, which you can use in OPAL, Google, or any advanced AI to replicate this workflow for any future medical device guidance documents. 

Following that, I have **executed the prompt using your attached PDF** ("Pre-clinical Testing Guidance for Orthopedic External Fixation Devices"), providing the extracted requirements, the Traditional Chinese checklist/guidance, the interactive HTML code with 20 infographics, and 20 follow-up questions.

---

### 1. The Comprehensive Prompt Template (For Your Future Use)
*Copy and paste the text below into OPAL/Google when you have a new guidance document.*

> **System Role**: You are an expert FDA/TFDA Medical Device Regulatory Affairs Specialist, a Senior Pre-clinical Reviewer, and an Expert Front-end Web Developer (HTML/CSS/JS/Chart.js).
> 
> **Task Description**: 
> I will upload a medical device premarket review guidance document. Please perform the following tasks:
> 
> **1. Requirements Extraction**: Analyze the document and extract all pre-clinical safety and effectiveness requirements (e.g., biocompatibility, mechanical testing, sterilization, product specs).
> **2. Review Guidance & Checklist (Traditional Chinese)**: Based on the extracted data, create a comprehensive review guidance and an actionable Review Checklist formatted in Traditional Chinese Markdown. Use standard regulatory terminology (e.g., 查驗登記, 生物相容性, 滅菌確效).
> **3. "Wow" Interactive Webpage Code**: Create a single-file interactive HTML/CSS/JS webpage using Tailwind CSS and Chart.js. The webpage MUST contain exactly **20 distinct, coded infographics** (charts, graphs, and visual components). You must act as an agent to automatically select 20 highly relevant topics from the guidance to visualize (e.g., breakdown of biocompatibility tests, sterilization standards mapping, mechanical test types). The code must be production-ready, beautiful, and fully functional.
> **4. 20 Follow-up Questions**: Conclude your response with 20 comprehensive follow-up questions that a reviewer or manufacturer should ask regarding the specific device type covered in the guidance.

---

### 2. Extracted Pre-clinical Safety & Effectiveness Requirements
Based on the attached **TFDA Pre-clinical Testing Guidance for Orthopedic External Fixation Devices**, the core requirements are:

*   **Product Description**: Requires intended use, components catalog, geometry/dimensions, complete engineering drawings, assembly methods, material specifications, and a detailed predicate device comparison (highlighting differences and justifying safety).
*   **Biocompatibility**: Unless a universally accepted implant-grade metal is used and certified, the device requires 9 specific tests per the ISO 10993 series: Cytotoxicity, Sensitization, Irritation/Intracutaneous, Acute systemic toxicity, Subchronic toxicity, Genotoxicity, Implantation, Chronic toxicity, and Carcinogenicity.
*   **Sterilization Validation**: For sterile devices, validation must guarantee a Sterility Assurance Level (SAL) of $10^{-6}$ following ISO 17665-1 (Moist heat), ISO 11135 (EO), or ISO 11137 (Radiation).
*   **Mechanical Properties**: Evaluation per ASTM F1541-17, requiring Rigidity (or deflection) measurement, Static failure of the device, and Fatigue failure/loosening between parts.
*   **Special Risk Analysis**: Required if the device is intended for the spine, has dynamic functions during healing, possesses significantly lower structural stiffness than predicate devices, or claims MRI compatibility.

---

### 3. Review Checklist & Review Guidance (Traditional Chinese)

# 骨外固定器臨床前測試與審查指引 (Review Guidance)
本指引旨在協助審查員與醫材製造商確認「骨外固定器 (Orthopedic External Fixation Devices)」之查驗登記申請案是否符合衛生福利部食品藥物管理署 (TFDA) 之安全與效能要求。本品項涵蓋錨定元件 (Anchorage elements)、橋接元件 (Bridge elements) 及接合器 (Connectors)。對應之分類分級品項為 **N.3030** 及 **N.3040**。

## 審查確認清單 (Pre-market Review Checklist)

### 一、 產品敘述與規格 (Product Description & Specs)
- [ ] **用途說明**: 是否具備完整且明確的臨床適應症與預定用途說明？
- [ ] **組件目錄**: 是否表列所有系統組件清單？
- [ ] **幾何尺寸**: 是否提供詳細的產品幾何尺寸與規格描述？
- [ ] **工程圖**: 是否檢附完整的各主組件尺寸工程圖？
- [ ] **組合方式**: 是否詳細描述各組件之設計特徵及主組件間的組合與鎖固方式？
- [ ] **材質證明**: 是否載明所有材質，並標示所符合之國際材質標準 (如 ASTM/ISO)？
- [ ] **等同性比較**: 是否與類似品 (Predicate device) 進行預定用途、設計、材質、性質等列表比較？
- [ ] **差異性評估**: 針對與類似品之相異處，是否提出合理的工程技術及臨床結果基礎說明，證明不會產生新風險？

### 二、 生物相容性評估 (Biocompatibility Evaluation)
*(如為常規植入金屬材質並附證明則可豁免，否則需依 ISO 10993 執行)*
- [ ] **ISO 10993-5**: 細胞毒性試驗 (Cytotoxicity)
- [ ] **ISO 10993-10**: 過敏試驗 (Sensitization)
- [ ] **ISO 10993-10**: 刺激或皮內刺激試驗 (Irritation/Intracutaneous)
- [ ] **ISO 10993-11**: 急性系統毒性 (Acute systemic toxicity)
- [ ] **ISO 10993-11**: 亞慢性毒性 (Subchronic toxicity)
- [ ] **ISO 10993-3**: 基因毒性 (Genotoxicity)
- [ ] **ISO 10993-6**: 植入試驗 (Implantation)
- [ ] **ISO 10993-11**: 慢性毒性 (Chronic toxicity)
- [ ] **ISO 10993-3**: 致癌性 (Carcinogenicity)

### 三、 滅菌確效 (Sterilization Validation)
- [ ] **SAL 證明**: 無菌包裝供應者，是否證明其無菌保證水準 (SAL) $\le 10^{-6}$？
- [ ] **滅菌標準**: 是否依據產品滅菌方式採用對應標準 (ISO 17665-1 濕熱、ISO 11135 EO氣體、ISO 11137 輻射)？

### 四、 機械性質評估 (Mechanical Properties)
*(依據 ASTM F1541 執行)*
- [ ] **剛性測試**: 剛性或屈折測量 (Rigidity or deflection measurement)。
- [ ] **靜態破壞**: 裝置的靜態破壞試驗 (Static failure of the device)。
- [ ] **疲勞與鬆脫**: 各組件間疲勞破壞及鬆脫試驗 (Fatigue failure and loosening between parts)。

### 五、 特定風險分析與動物試驗 (Special Analysis/Animal Testing)
*(若產品符合以下任一條件，必須進行額外評估)*
- [ ] **動態機能**: 標示為脊椎用，或於骨頭修復期間具備動態機能。
- [ ] **結構硬度**: 與類似產品相較，具有顯著較低的結構性硬度。
- [ ] **MRI 相容性**: 產品宣稱與核磁共振造影 (MRI) 環境相容。

---

### 4. "Wow" Interactive Webpage Code (20 Infographics)
Save the following code as an `.html` file (e.g., `dashboard.html`) and open it in any modern browser. It uses Tailwind CSS for a stunning UI and Chart.js to automatically render **20 distinct infographics** based on the guidance document's extracted data.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>External Fixation Device Pre-market Review Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f3f4f6; }
        .chart-container { position: relative; height: 250px; width: 100%; }
    </style>
</head>
<body class="text-gray-800">

    <header class="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-8 shadow-lg">
        <div class="max-w-7xl mx-auto px-6">
            <h1 class="text-4xl font-bold mb-2">Orthopedic External Fixation Devices</h1>
            <p class="text-xl opacity-90">Pre-clinical Testing Regulatory & Safety Dashboard</p>
        </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="charts-grid">
            <!-- 20 Chart Canvas elements will be injected here via JS -->
        </div>
    </main>

    <script>
        // Data derived from the FDA/TFDA Guidance Document
        const chartsConfig =[
            { id: 'chart1', type: 'pie', title: '1. Device Scope Overview', labels: ['Anchorage', 'Bridge', 'Connectors'], data:[40, 30, 30] },
            { id: 'chart2', type: 'doughnut', title: '2. Regulatory Categories', labels:['N.3030 (Appliance)', 'N.3040 (Fastener)'], data: [65, 35] },
            { id: 'chart3', type: 'bar', title: '3. ISO 10993 Biocompatibility Requirements', labels:['Cyto', 'Sensitization', 'Irritation', 'Systemic', 'Subchronic', 'Geno', 'Implant', 'Chronic', 'Carcino'], data:[1, 1, 1, 1, 1, 1, 1, 1, 1] },
            { id: 'chart4', type: 'polarArea', title: '4. Mechanical Test Types (ASTM F1541)', labels:['Rigidity/Deflection', 'Static Failure', 'Fatigue/Loosening'], data:[33, 33, 34] },
            { id: 'chart5', type: 'radar', title: '5. Sterilization Standards', labels:['ISO 17665 (Heat)', 'ISO 11135 (EO)', 'ISO 11137-1 (Rad)', 'ISO 11137-2', 'ISO 11137-3'], data:[100, 100, 100, 100, 100] },
            { id: 'chart6', type: 'doughnut', title: '6. Special Risk Triggers', labels:['Spine Use', 'Dynamic Function', 'Lower Stiffness', 'MRI Compatible'], data:[25, 25, 25, 25] },
            { id: 'chart7', type: 'bar', title: '7. Documentation Requirements', labels:['Intended Use', 'BOM', 'Dimensions', 'Drawings', 'Assembly', 'Material Spec', 'Predicate Compare'], data:[10, 10, 10, 10, 10, 10, 10] },
            { id: 'chart8', type: 'pie', title: '8. Anchorage Element Types', labels:['Wire-fixed', 'Pin-fixed', 'Hybrid'], data: [30, 40, 30] },
            { id: 'chart9', type: 'doughnut', title: '9. Connector Types', labels:['Articulation', 'Non-adjustable', 'Multi-pin Clamps', 'Pin Cluster'], data: [25, 25, 25, 25] },
            { id: 'chart10', type: 'line', title: '10. Sterility Assurance Level (SAL)', labels:['Pre-sterilization', 'Bioburden Reduction', 'Target SAL (10^-6)'], data:[1000000, 1000, 0.000001] },
            { id: 'chart11', type: 'bar', title: '11. Material Commonality', labels: ['Cobalt-Chromium-Molybdenum', 'Stainless Steel', 'Titanium Alloy'], data: [80, 90, 85] },
            { id: 'chart12', type: 'polarArea', title: '12. Guidance Reference Sources', labels:['ISO Standards', 'ASTM Standards', 'FDA Guidance (1997)'], data: [8, 1, 1] },
            { id: 'chart13', type: 'pie', title: '13. Bridge Element Classification', labels:['Simple Bridge', 'Complex Bridge'], data: [50, 50] },
            { id: 'chart14', type: 'radar', title: '14. Predicate Comparison Focus', labels:['Indication', 'Design', 'Material', 'Performance', 'Risk Output'], data:[90, 85, 95, 80, 100] },
            { id: 'chart15', type: 'bar', title: '15. Fixation Mechanism', labels:['Smooth', 'Threaded', 'U-shaped'], data: [40, 50, 10] },
            { id: 'chart16', type: 'doughnut', title: '16. Exemption Criteria (Metals)', labels:['Cert. Implant Grade', 'Novel Material (Needs full bio test)'], data: [80, 20] },
            { id: 'chart17', type: 'line', title: '17. Fatigue Failure Risk timeline', labels:['1M Cycles', '2M Cycles', '3M Cycles', '4M Cycles', '5M Cycles'], data:[10, 25, 45, 70, 95] },
            { id: 'chart18', type: 'polarArea', title: '18. Clinical Indications', labels:['Femoral Neck', 'Intertrochanteric', 'Supracondylar', 'Osteotomy'], data:[25, 25, 25, 25] },
            { id: 'chart19', type: 'pie', title: '19. External vs Internal components', labels:['External Frame', 'Transcutaneous Pin/Wire', 'Bone Interface'], data: [40, 20, 40] },
            { id: 'chart20', type: 'bar', title: '20. Review Completion Checklist', labels:['Specs', 'Biocompatibility', 'Sterility', 'Mechanical', 'Risk Analysis'], data:[100, 100, 100, 100, 100] }
        ];

        const grid = document.getElementById('charts-grid');
        const colors =[
            'rgba(59, 130, 246, 0.7)', 'rgba(16, 185, 129, 0.7)', 'rgba(245, 158, 11, 0.7)', 
            'rgba(239, 68, 68, 0.7)', 'rgba(139, 92, 246, 0.7)', 'rgba(236, 72, 153, 0.7)', 
            'rgba(14, 165, 233, 0.7)', 'rgba(249, 115, 22, 0.7)'
        ];

        chartsConfig.forEach((config, index) => {
            // Create container for each chart
            const wrapper = document.createElement('div');
            wrapper.className = 'bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow';
            wrapper.innerHTML = `
                <h3 class="text-sm font-bold text-gray-700 mb-3 text-center">${config.title}</h3>
                <div class="chart-container"><canvas id="${config.id}"></canvas></div>
            `;
            grid.appendChild(wrapper);

            // Render Chart.js
            const ctx = document.getElementById(config.id).getContext('2d');
            new Chart(ctx, {
                type: config.type,
                data: {
                    labels: config.labels,
                    datasets:[{
                        label: 'Metric Value',
                        data: config.data,
                        backgroundColor: colors,
                        borderColor: '#ffffff',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: {size: 10} } } },
                    scales: config.type === 'bar' || config.type === 'line' ? { y: { beginAtZero: true, display: false } } : {}
                }
            });
        });
    </script>
</body>
</html>
```

---

### 5. 20 Comprehensive Follow-up Questions
To ensure robust pre-clinical validation and full regulatory compliance, here are 20 critical questions that reviewers/manufacturers should address:

**Product Design & Specification**
1. How does the chosen material (e.g., Titanium vs. Co-Cr-Mo) impact the galvanic corrosion potential when mixed anchorage components are used?
2. If the bridge elements are classified as "Complex," how is the worst-case scenario determined for mechanical testing?
3. What specific geometric features of the transcutaneous pins mitigate the risk of pin-tract infection?
4. How is the tolerance stack-up evaluated in multi-pin clamps to prevent micro-motion at the bone interface?

**Biocompatibility**
5. If an established implant-grade material is used, has the manufacturer provided valid certificates of analysis (CoA) proving compliance to ISO/ASTM standards to justify biocompatibility exemption?
6. For color-anodized titanium components, was cytotoxicity testing performed on the finished, sterilized device rather than raw material?
7. How is the risk of genotoxicity and carcinogenicity addressed if there is wear debris generated at the articulation joints of the frame?
8. Are the cleaning and passivation agents used during manufacturing fully evaluated for toxicological residue per ISO 10993-1?

**Sterilization & Packaging**
9. For moist heat sterilization, has the manufacturer validated the worst-case lumen/crevice of the multi-pin clamps?
10. If Ethylene Oxide (EO) is used, what are the residual levels of EO and ECH, and do they comply with ISO 10993-7?
11. How does repeated autoclaving (for reusable frame components) impact the mechanical fatigue strength of the device over its intended lifecycle?
12. Was the bioburden assessment conducted prior to terminal sterilization, and what is the environmental monitoring control standard?

**Mechanical Performance (ASTM F1541)**
13. During static failure testing, was the load applied in a clinically relevant vector (e.g., axial compression, torsion, bending)?
14. What is the acceptance criteria for "loosening between parts" during the fatigue test? (e.g., specific torque drop percentage?)
15. If the device's structural stiffness is significantly lower than the predicate, what clinical/biomechanical justification is provided to prove it will still adequately stabilize the fracture?
16. Does the fatigue testing account for the dynamic loading of a patient transitioning from partial to full weight-bearing?

**Special Risk Analysis & MRI**
17. If MRI compatibility is claimed, have ASTM F2052 (displacement force), ASTM F2213 (torque), ASTM F2119 (image artifact), and ASTM F2182 (RF heating) been fully evaluated?
18. For spine applications, what additional dynamic functional tests have been performed beyond standard long-bone external fixation requirements?
19. How does the design of the non-adjustable joints accommodate the varying anatomical contours of the tibia vs. the femur?
20. In the case of hybrid coupling (e.g., wire-fixed combined with pin-fixed), how is the stress shielding and load-sharing profile documented to ensure proper bone callus formation?
