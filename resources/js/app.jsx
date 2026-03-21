import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import RootLayout from '@/Layouts/RootLayout';

const appName = import.meta.env.VITE_APP_NAME || 'Berong';

createInertiaApp({
    title: (title) => `${title}`,
    resolve: async (name) => {
        // Resolve .tsx and fallback to .jsx for Breeze 
        const page = await resolvePageComponent(
            `./Pages/${name}.tsx`, 
            import.meta.glob(['./Pages/**/*.tsx', './Pages/**/*.jsx']),
        ).catch(() => resolvePageComponent(
            `./Pages/${name}.jsx`, 
            import.meta.glob(['./Pages/**/*.tsx', './Pages/**/*.jsx']),
        ));
        
        // Attach the persistent layout globally if a page doesn't define its own
        if (!page.default.layout) {
            page.default.layout = (page) => <RootLayout>{page}</RootLayout>;
        }
        
        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
