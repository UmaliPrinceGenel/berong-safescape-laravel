const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir(path.resolve(__dirname, 'resources/js'), function(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.jsx') && !filePath.endsWith('.ts')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Next Link -> Inertia Link
    if (content.includes("from 'next/link'") || content.includes('from "next/link"')) {
        content = content.replace(/import\s+Link\s+from\s+['"]next\/link['"];?/g, "import { Link } from '@inertiajs/react';");
        content = content.replace(/href=\{([^}]+)\}/g, "href={$1}"); // Link href mapping is usually identical, but checking
        changed = true;
    }

    // Next Navigation -> Inertia Router
    if (content.includes("from 'next/navigation'") || content.includes('from "next/navigation"')) {
        content = content.replace(/import\s+\{.*\}\s+from\s+['"]next\/navigation['"];?/g, "import { router, usePage } from '@inertiajs/react';");
        content = content.replace(/const\s+[^=]+\s*=\s*useRouter\(\);?/g, ""); // Strip const router = useRouter()
        content = content.replace(/useRouter\(\)/g, "router");
        content = content.replace(/usePathname\(\)/g, "usePage().url");
        content = content.replace(/useSearchParams\(\)/g, "new URLSearchParams(window.location.search)");
        changed = true;
    }

    // Next Image -> Custom Image Mock
    if (content.includes("from 'next/image'") || content.includes('from "next/image"')) {
        content = content.replace(/import\s+Image\s+from\s+['"]next\/image['"];?/g, "import Image from '@/components/Image';");
        changed = true;
    }

    // Lucide React specific mappings if anything was strict
    // Just keeping it safe

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Migrated:', filePath);
    }
});
