#!/usr/bin/env node
/**
 * Script to automatically organize imports in TypeScript/TSX files
 * Adds React import and groups imports with comment headers
 */

const fs = require('fs');
const path = require('path');

// Files to process
const filesToProcess = [
    'src/app/dashboard/admin/components/UsageStats/UsageStats.tsx',
    'src/app/dashboard/admin/components/PricingBreakdown/PricingBreakdown.tsx',
    'src/app/dashboard/admin/components/UserManagement/UserManagement.tsx',
    'src/app/dashboard/admin/components/CostCalculator/CostCalculator.tsx',
    'src/app/dashboard/admin/components/Scenarios/Scenarios.tsx',
    'src/app/dashboard/subscription/components/PricingCards/PricingCards.tsx',
    'src/app/dashboard/subscription/components/UsageHistory/UsageHistory.tsx',
    'src/app/dashboard/subscription/components/CurrentPlan/CurrentPlan.tsx',
    'src/app/dashboard/generator/components/PastOutfits/PastOutfits.tsx',
    'src/app/dashboard/generator/components/ImageExpansionModal/ImageExpansionModal.tsx',
    'src/app/dashboard/account/components/ProfileSection/ProfileSection.tsx',
    'src/app/dashboard/closet/components/ClosetView/components/ClosetControls.tsx',
    'src/app/dashboard/closet/components/ClosetView/components/ClosetHeader.tsx',
    'src/app/dashboard/closet/components/ClosetView/components/ClosetGrid.tsx',
    'src/app/dashboard/closet/components/ClosetView/components/OutfitBuilder.tsx',
    'src/app/dashboard/closet/components/ClosetView/ClosetView.tsx',
    'src/app/dashboard/closet/components/ItemCard/ItemCard.tsx',
    'src/app/dashboard/closet/components/Slot/Slot.tsx',
];

function categorizeImport(line) {
    const trimmed = line.trim();

    // Skip React import (we'll add it separately)
    if (trimmed.includes('from "react"') || trimmed.includes("from 'react'")) {
        if (trimmed.startsWith('import React')) return 'react';
        return 'libraries';
    }

    // Libraries (external packages)
    if (trimmed.match(/from ["'](@clerk|@tanstack|next\/|lucide-react|sonner|framer-motion|recharts|nuqs|clsx|jotai|html2canvas|@uploadthing)/)) {
        return 'libraries';
    }

    // Components
    if (trimmed.includes('@/components/') || trimmed.includes('@/app/') && trimmed.includes('/components/') || trimmed.includes('./components/')) {
        return 'components';
    }

    // Hooks
    if (trimmed.includes('@/hooks/') || trimmed.includes('./hooks/')) {
        return 'hooks';
    }

    // Utils
    if (trimmed.includes('@/lib/') || trimmed.includes('@/utils/') || trimmed.includes('@/app/actions') || trimmed.includes('@/flags') || trimmed.includes('./utils/')) {
        return 'utils';
    }

    // Types
    if (trimmed.startsWith('import type') || trimmed.includes('@/types') || trimmed.includes('./types/')) {
        return 'types';
    }

    // Default to libraries
    return 'libraries';
}

function organizeImports(filePath) {
    const fullPath = path.join(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
        console.log(`❌ File not found: ${filePath}`);
        return false;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n');

    // Check if already organized
    if (content.includes('// Libraries') || content.includes('// Components')) {
        console.log(`⏭️  Already organized: ${filePath}`);
        return false;
    }

    let importStart = -1;
    let importEnd = -1;
    let useClient = false;
    let useClientLine = '';

    // Find import section
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line === '"use client";' || line === "'use client';") {
            useClient = true;
            useClientLine = lines[i];
            continue;
        }

        if (line.startsWith('import ') && importStart === -1) {
            importStart = i;
        }

        if (importStart !== -1 && !line.startsWith('import ') && line !== '' && !line.startsWith('//')) {
            importEnd = i;
            break;
        }
    }

    if (importStart === -1) {
        console.log(`⚠️  No imports found: ${filePath}`);
        return false;
    }

    if (importEnd === -1) importEnd = lines.length;

    // Extract and categorize imports
    const imports = lines.slice(importStart, importEnd).filter(line => line.trim());
    const categorized = {
        react: [],
        libraries: [],
        components: [],
        hooks: [],
        utils: [],
        types: []
    };

    let hasReact = false;
    for (const imp of imports) {
        const category = categorizeImport(imp);
        if (category === 'react' && imp.includes('import React')) {
            hasReact = true;
        }
        categorized[category].push(imp);
    }

    // Build new import section
    const newImports = [];

    // Add React import if not present
    if (!hasReact) {
        // Check if any import uses React hooks
        const hasHooks = imports.some(imp => imp.includes('useState') || imp.includes('useEffect') || imp.includes('useCallback'));
        if (hasHooks) {
            newImports.push('import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";');
        } else {
            newImports.push('import React from "react";');
        }
        newImports.push('');
    } else if (categorized.react.length > 0) {
        newImports.push(...categorized.react);
        newImports.push('');
    }

    // Add categorized imports
    const categories = [
        { key: 'libraries', label: 'Libraries' },
        { key: 'components', label: 'Components' },
        { key: 'hooks', label: 'Hooks' },
        { key: 'utils', label: 'Utils' },
        { key: 'types', label: 'Types' }
    ];

    for (const { key, label } of categories) {
        if (categorized[key].length > 0) {
            newImports.push(`// ${label}`);
            newImports.push(...categorized[key]);
            newImports.push('');
        }
    }

    // Remove trailing empty line
    while (newImports[newImports.length - 1] === '') {
        newImports.pop();
    }

    // Reconstruct file
    const newLines = [];
    if (useClient) {
        newLines.push(useClientLine);
        newLines.push('');
    }
    newLines.push(...newImports);
    newLines.push('');
    newLines.push(...lines.slice(importEnd));

    // Write back
    fs.writeFileSync(fullPath, newLines.join('\n'));
    console.log(`✅ Organized: ${filePath}`);
    return true;
}

// Process all files
console.log(`\n📦 Organizing imports in ${filesToProcess.length} files...\n`);

let processed = 0;
let skipped = 0;

for (const file of filesToProcess) {
    const result = organizeImports(file);
    if (result) processed++;
    else skipped++;
}

console.log(`\n✨ Complete! Processed: ${processed}, Skipped: ${skipped}\n`);
