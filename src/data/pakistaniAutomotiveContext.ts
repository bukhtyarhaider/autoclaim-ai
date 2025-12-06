export const PAKISTANI_MARKET_CONTEXT = `
# PAKISTANI AUTOMOTIVE MARKET CONTEXT - 2025 BASELINE

## 1. MARKET ARCHITECTURE & LABOR TIERS
Pricing depends heavily on the "Workshop Tier".
- **Tier A (Authorized Dealerships - 3S):** 
    - Use brand-new Genuine parts only.
    - High labor rates (Standardized Oven Paint).
    - Target: Warranty vehicles (0-3 years), Corporate fleets.
- **Tier B (Premium Independent):** 
    - Mix of Genuine and High-grade Aftermarket.
    - "Baked Paint" methodology.
    - Target: High-value post-warranty vehicles (Civic X/11, Sportage).
- **Tier C (Informal/Roadside):**
    - Manual craftsmanship (Hammer/Dolly). air-drying paints.
    - Use "Kabli" (used) or low-grade Chinese parts.
    - Target: Aging fleets (Mehran, Old Corolla).

### Labor Rates Reference (PKR)
| Service | Tier C (Roadside) | Tier B (Premium) | Tier A (Dealership) | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Denting (Per Panel)** | 1,500 - 3,000 | 3,500 - 5,000 | 6,000 - 10,000 | |
| **Dry Denting (PDR)** | 2,000 - 4,000 | 5,000 - 8,000 | 10,000+ | Prioritize if paint is intact |
| **Paint (Per Panel)** | 3,500 - 5,000 | 8,000 - 12,000 | 15,000 - 25,000 | Includes material |
| **Full Car Paint** | 35k - 50k | 80k - 120k | 200k+ | |

## 2. PARTS PRICING LOGIC
- **"Kabli" vs Aftermarket:** Used "Kabli" genuine parts often cost MORE than new Aftermarket copies due to "Genuine" preference.
- **"Genunie Paint" Factor:** Resale value drops with repainting. "Dry Denting" is preferred even at higher labor cost if it saves original paint.

## 3. MODEL-SPECIFIC DATA MATRIX (2025 APX PRICES IN PKR)

### ECONOMY HATCHBACKS (Suzuki Alto 660cc, Cultus)
- **Alto RS Turbo Conversion:** Watch for non-standard bumpers (mesh grille/fog lamps).
    - Standard Bumper: ~5,500 (Aftermarket) to 18,500 (Genuine).
    - RS Turbo Kit Bumper: ~13,000 (Kit) to 35,000 (Painted).
- **Mirrors:** Huge gap. Genuine ~10k vs Local Copy ~2k.
- **Common Repair:** Bumper Spacers (Brackets) break easily. Add ~1,200 PKR if bumper is hit.

| Part | Genuine (PKR) | Aftermarket (PKR) | Used/Kabli (PKR) | Labor Est (PKR) |
| :--- | :--- | :--- | :--- | :--- |
| **Alto Front Bumper** | 16,000 | 7,000 | 5,000 | 1,500 |
| **Alto Headlight** | 20,000 | 7,000 | 6,000 | 500 |
| **Alto Side Mirror** | 10,000 | 2,200 (Pair) | 4,000 | 300 |
| **Cultus Front Bumper**| 16,500 | 6,800 | 5,800 | 1,500 |

### COMPACT SEDANS (Toyota Yaris, Honda City)
- **Yaris Front:** Bumper is complex (Cover + Upper Grille + Lower Grille).
    - **Fender Shield:** Very fragile. Add ~3,000 (Genuine) or ~1,500 (Aftermarket) for any front-side impact.
- **City:** Headlights are major cost centers (Halogen ~30k vs LED ~100k).
    - **Mirror Covers:** Often just the cover breaks. Replace cover (4k) vs Full Assy (20k).

| Part | Genuine (PKR) | Aftermarket (PKR) | Used/Kabli (PKR) | Labor Est (PKR) |
| :--- | :--- | :--- | :--- | :--- |
| **Yaris Bumper Cover** | 20,000 | 8,500 | 10,000 | 2,500 |
| **Yaris Headlight** | 40,000 | 20,000 | 25,000 | 1,000 |
| **City Headlight** | 31,000 | 15,000 | 18,000 | 1,000 |
| **City Radiator** | 25,000 | 14,000 | 12,000 | 2,500 |

### FACELIFT SEDANS (Corolla 2014+, Civic X/11)
- **Facelift Culture:** Old Corollas (2015) often get "2021 X-Package" bumpers.
    - If a 2015 Corolla has front damage, check if "Facelift Kit" (~30k) is cheaper/better option than OEM restoration.
- **Civic:** "LaneWatch" Camera makes Left Mirror significantly more expensive than Right.

| Part | Genuine (PKR) | Aftermarket (PKR) | Used/Kabli (PKR) | Labor Est (PKR) |
| :--- | :--- | :--- | :--- | :--- |
| **Corolla X Bumper Kit**| N/A | 14,000 | N/A | 3,000 |
| **Civic X Bonnet** | 55,000 | N/A | 40,000 | 5,000 |

### CROSSOVERS (Kia Sportage, Hyundai Tucson)
- **"Front End Shock":** Extremely expensive front parts.
- **Fender Shield:** Genuine (~23k) vs Aftermarket (~3k). Always estimate Aftermarket for shields unless warranty claim.

| Part | Genuine (PKR) | Aftermarket (PKR) | Used/Kabli (PKR) | Labor Est (PKR) |
| :--- | :--- | :--- | :--- | :--- |
| **Sportage Headlight** | 175,000 | N/A | 95,000 | 2,500 |
| **Sportage Grille** | 50,000 | 30,000 | 35,000 | 1,500 |

## 4. CONTEXTUAL HEURISTICS FOR AI
1.  **The "Upgrade" Heuristic:** For older Corollas (2014-2017), suggest "Facelift Conversion" if bumper is damaged.
2.  **The "Shield" Probability:** If Yaris/City/Sportage has bumper/fender damage, AUTOMATICALLY add "Fender Shield (Aftermarket)" to estimate.
3.  **The "Clip" Factor:** Always add "Hardware/Clips" (PKR 500-1000) for any bumper job.
4.  **Dry Denting:** If paint is continuous (no chips), prioritize "Dry Denting" (Higher Labor, 0 Material Cost).
`;
