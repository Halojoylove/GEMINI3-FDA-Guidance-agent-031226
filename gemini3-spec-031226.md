Here is the comprehensive technical specification for the Agentic AI System for FDA 510(k) Review.
Comprehensive Technical Specification: Agentic AI System for FDA 510(k) Review
1. Executive Summary
The Agentic AI System for FDA 510(k) Review is a cutting-edge, single-page web application (SPA) designed to revolutionize the regulatory review process for medical devices. The FDA 510(k) clearance process requires reviewers to analyze thousands of pages of highly technical documentation, including device descriptions, bench testing, biocompatibility reports, software validation, and clinical data. This application leverages advanced Large Language Models (LLMs)—specifically the Google Gemini model family—to automate, summarize, analyze, and visualize these complex datasets.
Built with React, TypeScript, and Tailwind CSS, the system introduces a "WOW UI" that combines professional regulatory workflows with engaging, gamified elements and artistic theming. By utilizing a multi-agent architecture, the application allows users to orchestrate specialized AI personas (e.g., Regulatory Analyst, Risk Assessor, Testing Reviewer) in a sequential pipeline, drastically reducing review time while maintaining high analytical rigor.
This document serves as the definitive technical specification, detailing the system architecture, state management, AI integration strategy, component design, data models, and future extensibility pathways.
2. System Architecture
The application follows a Client-Side Single-Page Application (SPA) architecture. Currently, it operates entirely within the user's browser, communicating directly with third-party LLM APIs (Google GenAI) without a proprietary backend server.
2.1. Architectural Layers
Presentation Layer (UI): Built with React 18 functional components and hooks. Styling is handled via Tailwind CSS utility classes, enabling rapid, responsive, and consistent design.
State Management Layer: Utilizes React's Context API (AppContext) to maintain global state, including user preferences (theme, language), gamification metrics (health, mana, experience), API keys, and execution logs.
Service Layer: Encapsulates external API interactions. The llmService.ts module acts as an abstraction layer over the @google/genai SDK, standardizing how prompts, parameters, and API keys are passed to the models.
Data Layer (Local): Configuration data, such as agent definitions (agents.yaml) and skill definitions (SKILL.md), are fetched as static assets from the public directory and parsed client-side using js-yaml.
2.2. Data Flow
User Input: The user interacts with a specific tab (e.g., uploading a PDF in the OCR tab or pasting text in the Summary tab).
State Update: Local component state captures the input. If global settings are changed (e.g., switching the API key or theme), the Context API broadcasts the update.
Service Invocation: Upon triggering an action (e.g., "Analyze"), the component constructs a specialized prompt and calls callLLM() from the service layer.
API Execution: The service layer authenticates with the Google GenAI endpoint using the client-provided API key and streams/awaits the response.
Post-Processing: The raw Markdown or JSON response is returned to the component. For visualizations, JSON is parsed into structured arrays.
Render: The UI updates to display the generated Markdown (via dangerouslySetInnerHTML or a Markdown renderer) or renders Recharts components based on the parsed data.
Telemetry: The execution log and usage metrics (total runs, provider calls) are updated in the global Context.
3. Core Technologies & Dependencies
The technology stack was selected for rapid prototyping, high performance, and seamless integration with modern AI SDKs.
React (v18+): The core UI library. Chosen for its component-based architecture and robust ecosystem.
TypeScript: Provides static typing, enhancing code quality, developer experience, and reducing runtime errors, especially crucial when defining complex AI agent configurations and API responses.
Vite: The build tool and development server. Offers near-instant Hot Module Replacement (HMR) and highly optimized production builds.
Tailwind CSS: A utility-first CSS framework used for all styling. It allows for dynamic theming via CSS variables and ensures a responsive, modern aesthetic without the overhead of custom CSS files.
@google/genai: The official Google GenAI SDK used to interface with Gemini models (e.g., gemini-2.5-flash, gemini-3-flash-preview). It supports multimodal inputs (text, base64 PDFs/images) and structured JSON outputs.
Recharts: A composable charting library built on React components. Used in the "WOW Visualizations" tab to render ScatterCharts and LineCharts.
Lucide React: A comprehensive library of clean, customizable SVG icons used throughout the UI (e.g., Sidebar navigation, gamification stats).
js-yaml: A YAML parser and stringifier. Used to read the agents.yaml configuration file and allow users to edit and save agent configurations dynamically.
clsx & tailwind-merge: Utility libraries used to conditionally join Tailwind class names and resolve utility conflicts safely.
motion/react: Used for subtle, high-performance layout animations and page transitions (e.g., fading in the Tabs container).
4. Directory Structure & File Organization
The application's source code is organized into a modular, feature-based directory structure to promote maintainability and separation of concerns.
code
Text
/
├── public/
│   ├── agents.yaml           # Default AI agent configurations
│   └── SKILL.md              # Documentation of available AI skills
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Header.tsx        # Top navigation, gamification stats, titles
│   │   ├── Sidebar.tsx       # Settings, theme selection, API key inputs
│   │   └── TabsContainer.tsx # Tabbed navigation router
│   ├── context/
│   │   └── AppContext.tsx    # Global state management (Context API)
│   ├── lib/
│   │   └── utils.ts          # Utility functions (cn, twMerge)
│   ├── services/
│   │   └── llmService.ts     # Abstraction layer for LLM API calls
│   ├── tabs/                 # Feature-specific tab components
│   │   ├── AgentPipelineTab.tsx
│   │   ├── AgentsSkillsTab.tsx
│   │   ├── DashboardTab.tsx
│   │   ├── GuidanceTab.tsx
│   │   ├── NoteKeeperTab.tsx
│   │   ├── OCRAgentsTab.tsx
│   │   ├── ReviewReportTab.tsx
│   │   ├── SummaryTab.tsx
│   │   └── WOWVisualizationsTab.tsx
│   ├── App.tsx               # Root component, layout wrapper, theme injector
│   ├── constants.ts          # Global constants (Themes, Models, Colors)
│   ├── index.css             # Global CSS, Tailwind imports, base styles
│   └── main.tsx              # React DOM entry point
├── package.json              # Project dependencies and scripts
└── vite.config.ts            # Vite bundler configuration
5. State Management (Context API)
Given the complexity of a multi-agent system, centralized state management is critical. The application uses React's Context API (AppContext.tsx) to avoid prop-drilling and ensure that settings (like API keys and themes) are globally accessible.
5.1. Core Interfaces
The state is strictly typed using TypeScript interfaces:
code
TypeScript
export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  model: string;
  max_tokens: number;
  temperature: number;
  system_prompt: string;
  provider: string;
}

export interface AppState {
  language: string;         // 'en' or 'zh'
  themeMode: string;        // 'light' or 'dark'
  currentThemeId: string;   // ID linking to PAINTER_THEMES
  health: number;           // Gamification: 0-100
  mana: number;             // Gamification: 0-100, consumed by pipelines
  experience: number;       // Gamification: XP points
  level: number;            // Gamification: Calculated based on XP
  apiKeys: Record<string, string>; // Stores keys for gemini, openai, etc.
}
5.2. Context Provider Responsibilities
The AppProvider component initializes the state and provides several updater functions:
setState: Generic updater for user preferences and gamification metrics.
setAgents: Updates the array of available AI agents.
setMetrics: Tracks usage statistics, including total_runs, provider_calls (broken down by provider), tokens_used, and last_run_duration.
setExecutionLog: Maintains an array of log objects { time, type, msg } to provide an audit trail of AI actions, visible in the Dashboard.
refreshAgents: An asynchronous function that fetches the agents.yaml file from the public directory, parses it using js-yaml, and populates the agents state. It includes a fallback mechanism to instantiate a default "Regulatory Analyst" agent if the fetch fails.
5.3. Environment Variable Handling
To ensure seamless local development and deployment, the Context API initializes the Gemini API key by checking Vite's import.meta.env and Node's process.env.
code
TypeScript
apiKeys: {
  gemini: (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '',
  // ...
}
6. AI & LLM Integration Strategy
The core value proposition of this application is its integration with Large Language Models. This is abstracted into the src/services/llmService.ts module.
6.1. The callLLM Abstraction
The callLLM function serves as a unified interface for all AI requests. While currently optimized for Google's Gemini models via the @google/genai SDK, the function signature is designed to be provider-agnostic, allowing future integration with OpenAI, Anthropic, or xAI.
Function Signature:
code
TypeScript
export const callLLM = async (
  provider: string,
  model: string,
  systemPrompt: string,
  userInput: string,
  maxTokens: number,
  temperature: number,
  apiKeys: Record<string, string>
): Promise<string>
6.2. Gemini SDK Implementation
When the provider is 'gemini', the service instantiates the GoogleGenAI client. It utilizes the generateContent method, passing the systemPrompt as a systemInstruction within the config object. This ensures the model adheres strictly to its assigned persona (e.g., Regulatory Analyst) before processing the userInput.
Error handling is implemented using standard try/catch blocks, catching SDK-specific errors (e.g., quota limits, invalid API keys) and throwing standardized error messages back to the UI components for logging and user notification.
6.3. Multimodal Capabilities (PDF OCR)
In the OCRAgentsTab, the system leverages Gemini's multimodal capabilities to perform Optical Character Recognition (OCR) and text extraction directly from PDF files.
When a user uploads a PDF, the file is read as a Base64 string using FileReader. The application then constructs a multimodal prompt containing both the Base64 data (with mimeType: 'application/pdf') and a text instruction ("Extract the text from pages X-Y..."). This bypasses the need for traditional, error-prone OCR libraries (like Tesseract.js) by utilizing the LLM's native vision and document understanding capabilities.
7. User Interface & Theming Engine
The UI is designed to be highly engaging, stepping away from traditional, sterile enterprise software by introducing artistic themes and gamification.
7.1. Dynamic Painter Themes
Defined in src/constants.ts, the application features 20 distinct themes inspired by famous painters (e.g., Van Gogh, Monet, Klimt, Picasso). Each theme defines a palette:
code
TypeScript
{
  id: 'vangogh_starry',
  name_en: 'Van Gogh · Starry Night',
  primary: '#1B3B6F',
  secondary: '#F4D03F',
  accent: '#F39C12',
  bg: '#0B1020',
}
Implementation: In App.tsx, a useEffect hook listens for changes to state.currentThemeId and state.themeMode. It dynamically injects these hex codes into the document's root as CSS variables (--primary, --bg-color, etc.). Tailwind CSS utility classes (e.g., bg-primary, text-accent) reference these variables, allowing the entire application to instantly re-theme without page reloads.
7.2. Gamification Mechanics
To reduce reviewer burnout, the Header.tsx component introduces RPG-like elements:
Health: Represents overall system stability.
Mana: Required to run complex operations (e.g., the Multi-Agent Pipeline costs 20 Mana).
Experience (XP) & Leveling: Users gain XP by executing AI tasks. The level is calculated dynamically: Level = 1 + Math.floor(XP / 100).
Achievement Blossoms: As users reach XP thresholds or run counts, badges unlock dynamically in the header (e.g., "🌸 First Bloom Reviewer", "🌺 Seasoned 510(k) Reviewer").
Regulatory Stress Meter: A visual indicator calculated inversely from Health (100 - state.health), providing a playful metric of review difficulty.
7.3. Layout Structure
The layout utilizes a CSS Grid and Flexbox hybrid approach:
Sidebar (Fixed Left): Contains global settings, theme selectors, language toggles, and API key inputs.
Main Content Area (Right):
Header (Top): Displays the app title, gamification stats, and active theme.
Tabs Container (Bottom): A horizontally scrollable tab list that mounts/unmounts specific feature components based on the active index.
8. Detailed Module Specifications (The Tabs)
The application's functionality is divided into nine distinct tabs, each serving a specific phase of the FDA 510(k) review lifecycle.
8.1. 510(k) Summary Analysis (SummaryTab.tsx)
Purpose: To ingest a raw 510(k) summary document and generate a structured, highly readable Markdown overview.
Mechanism: The user pastes raw text. The component provides dropdowns to select the AI Provider, Model, and Temperature.
Prompt Engineering: The default prompt instructs the LLM to act as an FDA reviewer, format the output into specific sections (Device Overview, Intended Use, Technological Characteristics, etc.), and highlight 20-40 critical keywords using a specific HTML span tag with a coral color (#FF7F50).
Output: Renders the generated Markdown using dangerouslySetInnerHTML.
8.2. Review Guidance Builder (GuidanceTab.tsx)
Purpose: To convert dense FDA guidance documents into actionable reviewer checklists.
Mechanism: Accepts two inputs: the raw guidance text and optional specific reviewer instructions (e.g., "focus on cybersecurity").
Prompt Engineering: Instructs the LLM to generate a narrative guideline followed by a detailed Markdown table checklist with columns for Item, Question, Evidence to Confirm, and Pass/Fail/NA.
8.3. Submission OCR & Agents (OCRAgentsTab.tsx)
Purpose: To extract text from uploaded PDF submissions and run targeted AI agents against that text.
Mechanism:
File Upload: Accepts .pdf, .txt, and .md files. PDFs are rendered in an iframe for preview.
OCR Extraction: Converts the PDF to Base64 and sends it to the selected Gemini model with a prompt to extract text from specified pages.
Editor: Provides a toggle between raw text editing and Markdown preview.
Auto Summary: A quick-action button to generate a 2000-word summary of the extracted text.
Agent Execution: A dropdown allows the user to select a specific agent from the global state (e.g., "Risk Assessor") and execute its specific system_prompt against the OCR text.
8.4. Review Report Composer (ReviewReportTab.tsx)
Purpose: To draft the final, formal FDA 510(k) review report.
Mechanism: Combines reviewer instructions with raw review materials (notes, test summaries).
Prompt Engineering: Forces the LLM to generate a comprehensive 2000–3000 word report containing an Executive Summary, Regulatory Background, Risk/Benefit Discussion, and a table of Deficiencies.
8.5. Multi-Agent Pipeline (AgentPipelineTab.tsx)
Purpose: To orchestrate a sequential chain of AI agents, passing the output of one agent as the input to the next.
Mechanism:
The user provides a "Global Case Input".
Upon clicking "Run Full Pipeline", the component iterates through the agents array.
Data Flow: Output(Agent N) -> Input(Agent N+1).
Gamification Integration: Checks if state.mana >= 20. Deducts 20 Mana and adds 10 XP per successful pipeline run.
UI Updates: Renders the output of each agent in a separate, scrollable card as the pipeline progresses.
8.6. AI Note Keeper (NoteKeeperTab.tsx)
Purpose: A scratchpad for reviewers with built-in "AI Magics" to format and structure raw thoughts.
Mechanism: Features a dropdown of predefined transformations:
Structured Markdown: Cleans up raw notes.
Regulatory Entity Table: Extracts 20 entities into a Markdown table.
Risk & Mitigation Matrix: Builds a hazard analysis table.
Testing Coverage Map: Identifies gaps in bench/clinical testing.
AI Keywords: A purely client-side regex function that highlights user-defined keywords with custom hex colors (e.g., biocompatibility#FF0000).
8.7. Agents & Skills Configuration (AgentsSkillsTab.tsx)
Purpose: To allow power users to modify the behavior, prompts, and parameters of the AI agents dynamically.
Mechanism: Provides two raw text areas. One for editing the agents.yaml configuration and another for SKILL.md.
State Update: Clicking "Save agents.yaml" parses the text using js-yaml and updates the global agents context, immediately altering the behavior of the Agent Pipeline and OCR tabs.
8.8. Interactive Analytics Dashboard (DashboardTab.tsx)
Purpose: To provide telemetry and audit logs of AI usage.
Mechanism: Reads from AppContext.metrics and AppContext.executionLog. Displays total calls, provider-specific calls, and a reverse-chronological timeline of execution events (color-coded for success/error/info).
8.9. WOW Visualizations (WOWVisualizationsTab.tsx)
Purpose: To transform dense regulatory text into interactive, data-rich charts.
Mechanism:
The user inputs text. The component executes three parallel LLM calls.
Strict JSON Prompting: Each prompt explicitly demands only a JSON array with specific keys (e.g., [{"name": "Bug", "severity": 4, "likelihood": 3}]).
Parsing: The responses are stripped of Markdown backticks and parsed via JSON.parse().
Rendering (Recharts):
Risk Heatmap: A ScatterChart mapping Likelihood (X-axis) vs. Severity (Y-axis). A custom getRiskColor function colors the nodes green, yellow, or red based on the calculated risk score (Severity * Likelihood).
Milestone Timeline: A LineChart mapping sequential steps.
Entity Constellation: A 3D-like ScatterChart utilizing X, Y, and Z (size) axes to plot entities in a spatial arrangement, with dynamic HSL coloring based on index.
9. Data Models & Schemas
9.1. Agent Configuration (agents.yaml)
The system relies on a YAML structure to define agents. This allows non-developers to tune prompts without altering React code.
code
Yaml
agents:
  - id: "agent_1"
    name: "Regulatory Analyst"
    description: "Analyzes regulatory documents for compliance."
    model: "gemini-2.5-flash"
    max_tokens: 8000
    temperature: 0.2
    system_prompt: "You are a regulatory analyst..."
    provider: "gemini"
9.2. Visualization JSON Schemas
To ensure Recharts can render the LLM output, the prompts in WOWVisualizationsTab.tsx enforce strict JSON schemas. If the LLM hallucinates or returns malformed JSON, the try/catch block silently fails, preventing application crashes.
Risk Schema: Array<{ name: string, severity: number, likelihood: number }>
Timeline Schema: Array<{ step: string, time: number, value: number }>
Entity Schema: Array<{ name: string, x: number, y: number, size: number }>
10. Security & Privacy Considerations
10.1. API Key Management
Currently, the application is a client-side SPA. API keys are either loaded from environment variables (.env) during the build process or entered manually by the user in the Sidebar.
Risk: If deployed publicly as-is, environment-injected API keys would be exposed to the client browser.
Mitigation (Current): The application relies on user-provided keys via the UI for secure usage.
Production Recommendation: For a true production deployment, the callLLM function must be refactored to call a secure backend proxy (e.g., Node.js/Express or serverless functions). The backend would securely hold the API keys and forward requests to the Google GenAI endpoints, preventing client-side key exposure.
10.2. Data Privacy (PHI/PII)
FDA 510(k) submissions may contain sensitive proprietary information or Protected Health Information (PHI) in clinical data.
Consideration: Sending this data to public LLM APIs poses a data leakage risk.
Production Recommendation: Ensure that enterprise agreements with LLM providers (e.g., Google Cloud Vertex AI) are in place, guaranteeing zero data retention for model training. Additionally, implement local PII/PHI scrubbing algorithms before data leaves the browser.
11. Performance Optimization
11.1. React State Batching
React 18's automatic batching is utilized extensively. When an LLM call completes, multiple state updates (e.g., setResult, setMetrics, setExecutionLog, setLoading) are batched into a single render cycle, preventing UI stuttering.
11.2. DOM Size and Rendering
Markdown rendering via dangerouslySetInnerHTML can create large DOM trees for 3000-word reports.
Optimization: The application uses CSS overflow-y-auto and fixed heights to contain these elements, preventing layout thrashing on the main window.
11.3. Recharts Performance
Recharts is highly optimized, but rendering hundreds of scatter points can degrade performance. The LLM prompts explicitly limit the output to "5 key risks" or "5 key entities" to ensure the charts remain snappy and visually comprehensible.
12. Future Extensibility & Roadmap
The architecture is designed to be highly extensible. Based on the 20 follow-up questions generated, here are the technical pathways for future enhancements:
Backend Integration (Node.js/Express): Transitioning from a pure SPA to a Full-Stack application. This will allow for secure API key storage, database integration (PostgreSQL/MongoDB) for saving review reports, and handling heavier processing tasks.
Retrieval-Augmented Generation (RAG): Integrating a vector database (e.g., Pinecone, ChromaDB). Reviewers could upload historical 510(k) clearances. The system would chunk, embed, and store these documents. Future LLM prompts would dynamically pull relevant predicate data to ground the AI's responses, reducing hallucinations.
Advanced OCR Pipeline: Integrating Python-based microservices (using PyMuPDF or Tesseract) to handle complex, poorly scanned PDFs, extracting tables and images accurately before passing the text to the LLM.
Real-time Collaboration: Implementing WebSockets (via Socket.io or Firebase) in the NoteKeeperTab to allow multiple reviewers to edit and apply "AI Magics" to the same document simultaneously.
Automated Deficiency Tracking: Expanding the AgentPipelineTab to include an agent that cross-references the generated Review Report against a strict FDA database schema, automatically flagging missing sections and generating draft email templates for sponsor communication.
13. Conclusion
The Agentic AI System for FDA 510(k) Review represents a paradigm shift in regulatory software. By combining the analytical power of the Gemini model family with a highly interactive, gamified, and aesthetically pleasing React interface, it transforms a traditionally tedious process into an engaging, highly efficient workflow. The modular architecture, robust state management, and flexible LLM service layer ensure that the application is not only functional today but primed for future enterprise-scale enhancements.
