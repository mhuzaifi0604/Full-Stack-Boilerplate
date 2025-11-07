exports.getDashboardRoutesHealth = async (req, res) => {
    const dashboardInfo = [
        {
            title: "Frontend Structure (React + Vite)",
            items: [
                "src/pages → Application Screens & Views",
                "src/components → Reusable UI Components",
                "src/contexts → Auth & Theme Providers",
                "src/config → Axios Clients & Env Configurations"
            ],
            icon: "💻"
        },
        {
            title: "Backend Structure (Node.js + Express + Sequelize)",
            items: [
                "routes/ → Define API Endpoints",
                "services/ → Business Logic Layer",
                "Models/ → Database Models & Associations",
                "DB/ → DB Connection Settings"
            ],
            icon: "🛠️"
        },
        {
            title: "Authentication",
            items: [
                "All /dashboard routes are protected by JWT.",
                "Use Authorization: Bearer <token>"
            ],
            icon: "🔐"
        },
    ];

    return res.status(200).json(dashboardInfo);
};


exports.getDashInfo = async (req, res) => {
    res.status(200).send("Dashboard Information Endpoint")
}