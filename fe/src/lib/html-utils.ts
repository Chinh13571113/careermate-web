/**
 * Removes admin-specific UI elements from HTML content for public display
 * @param html - Raw HTML content from editor
 * @returns Cleaned HTML content safe for public display
 */
export function cleanHtmlForDisplay(html: string): string {
    if (!html) return '';

    // Remove delete buttons from images
    let cleaned = html.replace(/<button[\s\S]*?class="[^"]*delete-image-btn[^"]*"[\s\S]*?<\/button>/gi, '');

    // Remove the edit-mode class from image wrappers
    cleaned = cleaned.replace(/class="[^"]*edit-mode[^"]*"/gi, (match) => {
        return match.replace(/\s*edit-mode\s*/g, '').replace(/\s{2,}/g, ' ').trim();
    });

    // Remove empty image wrapper divs that might be left after cleaning buttons
    cleaned = cleaned.replace(/<div[^>]*class="[^"]*image-wrapper[^"]*"[^>]*>\s*<\/div>/gi, '');

    return cleaned.trim();
}

/**
 * Sanitizes HTML content by removing potentially dangerous elements and attributes
 * @param html - HTML content to sanitize
 * @returns Sanitized HTML
 */
export function sanitizeHtml(html: string): string {
    if (!html) return '';

    // Remove script tags and their content
    let cleaned = html.replace(/<script[\s\S]*?<\/script>/gi, '');

    // Remove javascript: URLs from attributes
    cleaned = cleaned.replace(/javascript:[^"'\s>]+/gi, '');

    // Remove on* event handlers
    cleaned = cleaned.replace(/\son\w+="[^"]*"/gi, '');

    return cleaned;
}
