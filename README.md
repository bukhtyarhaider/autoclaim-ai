# Carscube AI

**AI-Powered Vehicle Damage Assessment (Instant Severity + Repair Cost Estimate)**

Carscube AI is a web application that helps people quickly understand vehicle damage from photos. Instead of relying on slow manual inspection or vague guesses, users upload an image and receive an immediate assessment: **damage type detection**, **severity classification**, and a **preliminary repair cost estimate** adjusted for the vehicle category (economy vs luxury) and localized currency support (e.g., PKR).

---

## Why This Project

Vehicle damage assessment is often:

* **Slow** (waiting for workshops or surveyors)
* **Inconsistent** (depends on who inspects and how experienced they are)
* **Hard to document** (especially when reporting to insurance or keeping history)

Carscube AI was built to reduce this friction by providing a fast, structured, and repeatable first-pass assessment that users can use for decision-making and documentation.

---

## What It Solves

Carscube AI solves a practical gap between “I have a damaged car photo” and “I need an actionable estimate/report”.

It provides:

* A **clear damage summary** (scratches, dents, cracks, etc.)
* A **severity label** (Low / Medium / High / Critical)
* A **repair estimate breakdown** (Parts + Labor + Paint)
* A **vehicle-aware estimate** (Make/Model/Generation → economy vs luxury pricing logic)
* **exportable reports** suitable for sharing and record keeping
* A **dashboard** to review previous assessments (for tracking & history)

> This is meant as an *instant preliminary assessment*, not a replacement for an on-site inspection.

---

## Mini Case Study

### Problem

Drivers, used-car buyers, and insurance-related workflows often need a quick damage estimate, but most solutions require either:

* professional inspection (time + cost), or
* manual comparison with price tables (error-prone + inconsistent)

### Goal

Create a modern web app that can:

1. interpret damage from an uploaded photo
2. classify severity consistently
3. output an estimated cost with a structured breakdown
4. generate a shareable report

### Solution (How It Works)

Carscube AI uses **Google Gemini 2.5 Flash** for multimodal reasoning on uploaded images and structures the response into a predictable report format.

Core flow:

1. **User uploads damage photo**
2. App sends the image to **Gemini 2.5 Flash** with a prompt designed to extract:

   * damage types and affected areas
   * severity classification
   * repair estimate components (parts/labor/paint)
   * vehicle identification (make/model/generation)
3. The UI renders a **clean report view**
4. User can **export** the report (PDF) and store it in their dashboard history

### Output Format (What the user gets)

* Damage types detected (e.g., scratch, dent)
* Severity category: Low / Medium / High / Critical
* Estimated cost range + breakdown
* Vehicle identification (when possible)
* Exportable summary report

---

## Impact

Carscube AI improves damage assessment by making it:

* **Faster:** instant AI response vs waiting for manual inspection
* **More consistent:** standard severity levels & structured reporting
* **More usable:** exportable reports for sharing (insurance / workshop / personal record)
* **More scalable:** same workflow works across users and vehicles

---

## Features

* **Instant Damage Detection**: Detects scratches, dents, cracks, and visible body damage.
* **Severity Classification**: Categorizes damage as Low, Medium, High, or Critical.
* **Cost Estimation**: Provides preliminary repair estimates (Parts + Labor + Paint), with localized currency support (e.g., PKR).
* **Vehicle Identification**: Attempts to identify Make, Model, and Generation to adjust estimate logic (Economy vs. Luxury).
* **User Dashboard**: Review past assessments and reports.
* **Exportable Reports**: Generate PDF reports for documentation and sharing.

---

## Tech Stack

* **Frontend**: React 19, Vite, Tailwind CSS
* **AI Integration**: Google Generative AI SDK (Gemini 2.5 Flash)
* **Visualization**: Recharts, Lucide React
* **Utilities**: jsPDF, html2canvas

---

## Setup & Installation

### Prerequisites

* Node.js (v18+ recommended)
* Gemini API enabled in a Google Cloud Project
* A Gemini API key

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the root directory:

   ```env
   API_KEY=your_gemini_api_key_here
   ```

   > The app currently reads `process.env.API_KEY`. If you're using Vite conventions, you may prefer `VITE_API_KEY` and update the config accordingly.

3. Run the app:

   ```bash
   npm run dev
   ```

4. Open the URL shown in the terminal (commonly `http://localhost:5173`).

---

## Usage

1. Upload a vehicle damage image.
2. Wait for AI analysis.
3. Review the structured report (damage + severity + estimate).
4. Export or save the report to your dashboard history.

---

## Notes & Limitations

* Results are **preliminary** and based on visible damage in the photo.
* Real repair costs vary by region, workshop rates, parts availability, and hidden/internal damage.
* Vehicle identification depends on image clarity and angles.

