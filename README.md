# Carcubes AI

**AI-Powered Vehicle Damage Assessment**

Carcubes AI is a modern web application that leverages Google's Gemini 2.5 Flash model to provide instant and accurate vehicle damage assessments. Users can upload photos of vehicle damage to receive immediate analysis, including severity classification and estimated repair costs.


## Features

- **Instant Damage Detection**: Identifies scratches, dents, cracks, and other damages in seconds using advanced Computer Vision models.
- **Severity Classification**: Automatically classifies damage severity as Low, Medium, High, or Critical.
- **Cost Estimation**: Provides preliminary repair cost estimates (Parts + Labor + Paint), with support for localized currencies (e.g., PKR).
- **Vehicle Identification**: Identifies the Make, Model, and Generation of the vehicle to adjust pricing logic (Economy vs. Luxury).
- **User Dashboard**: Track previous assessments and view detailed reports.
- **Exportable Reports**: Generate professional reports for insurance or record-keeping.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **AI Integration**: Google Generative AI SDK (Gemini 2.5 Flash)
- **Visualization**: Recharts, Lucide React
- **Utils**: jsPDF, html2canvas

## Setup & Installation

Follow these steps to run the application locally.

### Prerequisites

- Node.js (v18 or higher recommended)
- A Google Cloud Project with the Gemini API enabled
- An API Key for Gemini

### Installation

1.  **Clone the repository** (if applicable) or navigate to the project directory.

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Create a `.env.local` file in the root directory and add your customized Google Gemini API key.
    
    ```env
    API_KEY=your_gemini_api_key_here
    ```
    > **Note**: The application code explicitly looks for `process.env.API_KEY`. Ensure your environment is configured to expose this, or use `VITE_API_KEY` if you modify the configuration.

4.  **Run the application**:
    ```bash
    npm run dev
    ```

5.  Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

## Usage

1.  Click on the upload area to select a vehicle image.
2.  Wait for the AI to analyze the image.
3.  View the detailed report including detected damages and estimated costs.
4.  Log in to save your history and manage reports.

## License

[Add License Information Here]
