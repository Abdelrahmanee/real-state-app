import { readFileSync } from 'fs';
import { join } from 'path';

let tempEmailDomains = [];

try {
    // Load the list of temporary email domains
    tempEmailDomains = readFileSync(join(process.cwd(), 'tempemail.s.txt'), 'utf-8')
        .split(/\r?\n/)
        .filter(Boolean)
        .map(domain => domain.trim().toLowerCase());
} catch (error) {
    console.error("Failed to load temp email domains:", error);
}

// Function to check if an email is from a temp email domain
export function isTempEmail(email) {
    const domain = email.split('@')[1].toLowerCase();
    return tempEmailDomains.includes(domain);
}
