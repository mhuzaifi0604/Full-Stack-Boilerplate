exports.getSettingsRoutesHealth = async (req, res) => {
    const settingsInfo = [
        {
            title: "Purpose of Settings Module",
            icon: "⚙️",
            items: [
                "This area handles user preferences & personalization.",
                "Used to manage account, profile, and application behavior."
            ],
        },
        {
            title: "Where to Add New Settings Logic",
            icon: "🧩",
            items: [
                "Backend/routes/settingsRoutes.js → Define new API endpoints.",
                "Backend/services/settingsService.js → Add business logic functions.",
            ],
        },
        {
            title: "Frontend Integration",
            icon: "🎨",
            items: [
                "Use axiosSettingsClient for all requests.",
                "Component path: Frontend/src/pages/Settings.jsx",
            ],
        },
        {
            title: "Security",
            icon: "🔐",
            items: [
                "All /settings routes are protected using JWT middleware.",
            ],
        },
    ];

    return res.status(200).json(settingsInfo);
};



exports.getSettingsInfo = async (req, res) => {
    res.status(200).send("Settings Information Endpoint")
}