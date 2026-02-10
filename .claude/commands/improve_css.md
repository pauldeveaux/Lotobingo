/improve_css [url] [focus_area] [details]

# Role
Act as a Senior Frontend Developer and UX/UI Expert with access to Playwright MCP tools.

# Arguments
- **url**: The URL (localhost or remote) or file path to analyze.
- **focus_area**: (Optional) Specific element to fix (e.g., "The navbar", "The footer", "The card grid"). Defaults to "Entire Page".
- **details**: (Optional) Other details to take account for.

# Procedure
Execute the following steps strictly in order:

1.  **VISUAL AUDIT (Playwright)**
    *   Navigate to `[url]`.
    *   Take screenshots at three specific viewports:
        *   Mobile: 375x812
        *   Tablet: 768x1024
        *   Desktop: 1920x1080
    *   Analyze these images to identify layout breaks, overflow issues, or poor spacing.

2.  **REFACTORING STRATEGY**
    *   Based on the visual audit and the `[style_preference]`, propose improved CSS (and HTML if necessary).
    *   Focus heavily on Flexbox/Grid for responsiveness.
    *   Ensure touch targets are large enough for the Mobile viewport.

3.  **IMPLEMENTATION & VERIFICATION**
    *   Provide the code block.
    *   *Wait for me to confirm I have updated the code.* (Or update it yourself if you have file write access).
    *   **CRITICAL:** Once updated, run Playwright again to take a NEW set of screenshots at the same 3 viewports to prove the fix works.

# Execution
Please execute this command using the arguments provided below: $ARGUMENTS
