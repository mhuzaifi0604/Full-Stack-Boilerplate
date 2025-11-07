
import {
    Network,
    Settings
} from 'lucide-react';

export const sidebarRoutes = [
    {
        id: 'dashboard',
        name: 'Dashboard',
        path: '/dashboard',
        icon: Network,
        category: 'monitoring'
    },
    {
        id: 'settings',
        name: 'Settings',
        path: '/settings',
        icon: Settings,
        category: 'account'
    }
];

// Category configurations for future expansion
export const routeCategories = {
    monitoring: {
        name: 'Monitoring',
        order: 1,
        showHeader: true
    },
    account: {
        name: 'Account',
        order: 2,
        showHeader: true
    }
};

// Get routes grouped by category
export const getGroupedRoutes = () => {
    const grouped = {};

    sidebarRoutes.forEach(route => {
        if (!grouped[route.category]) {
            grouped[route.category] = [];
        }
        grouped[route.category].push(route);
    });

    // Sort categories by order
    const sortedCategories = Object.keys(grouped).sort((a, b) => {
        return routeCategories[a].order - routeCategories[b].order;
    });

    const result = {};
    sortedCategories.forEach(category => {
        result[category] = grouped[category];
    });

    return result;
};

// Find route by path
export const findRouteByPath = (path) => {
    return sidebarRoutes.find(route => route.path === path);
};