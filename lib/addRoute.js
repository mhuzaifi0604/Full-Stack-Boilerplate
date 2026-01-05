const path = require("path");
const { routePrompts } = require("./prompts");
const fs = require("fs-extra");


module.exports = async function addRoute() {
    console.log(`\n➕ Add New Route to Backend\n`);

    const targetDir = process.cwd();
    const backendDir = path.join(targetDir, "Backend");
    const routesDir = path.join(backendDir, "routes");
    const servicesDir = path.join(backendDir, "services");

    // Check if we're in a valid project
    if (!await fs.pathExists(backendDir)) {
        console.log(`❌ Error: No backend folder found. Are you in a project root directory?`);
        console.log(`   Run this command from your project root (where backend/ folder exists).`);
        return;
    }

    if (!await fs.pathExists(routesDir)) {
        console.log(`❌ Error: No routes folder found in backend.`);
        return;
    }

    try {
        // Get route info from user
        const routeInfo = await routePrompts();

        const routeFileName = `${routeInfo.routeName}Routes.js`;
        const serviceFileName = `${routeInfo.routeName}Service.js`;
        const routeFilePath = path.join(routesDir, routeFileName);
        const serviceFilePath = path.join(servicesDir, serviceFileName);

        // Check if files already exist
        if (await fs.pathExists(routeFilePath)) {
            console.log(`⚠️  Route file ${routeFileName} already exists. Aborting.`);
            return;
        }

        if (await fs.pathExists(serviceFilePath)) {
            console.log(`⚠️  Service file ${serviceFileName} already exists. Aborting.`);
            return;
        }

        // Create route file
        const routeContent = generateRouteFile(routeInfo);
        await fs.writeFile(routeFilePath, routeContent);
        console.log(`✅ Created route file: routes/${routeFileName}`);

        // Create service file
        const serviceContent = generateServiceFile(routeInfo);
        await fs.writeFile(serviceFilePath, serviceContent);
        console.log(`✅ Created service file: services/${serviceFileName}`);

        // Update routes/index.js
        await updateRoutesIndex(routesDir, routeInfo);
        console.log(`✅ Updated routes/index.js`);

        console.log(`\n🎉 Route '${routeInfo.routeName}' added successfully!`);
        console.log(`\n📝 Next steps:`);
        console.log(`   1. Implement your business logic in services/${serviceFileName}`);
        console.log(`   2. Add more endpoints in routes/${routeFileName}`);
        console.log(`   3. Test your endpoints at ${routeInfo.routePath}`);

    } catch (err) {
        console.log(`❌ Error adding route:`, err.message);
    }
};

function generateRouteFile(routeInfo) {
    const requireAuth = routeInfo.needsAuth
        ? `const { authenticateToken } = require('../middleware/authMiddleware');\n`
        : '';

    const authMiddleware = routeInfo.needsAuth ? 'authenticateToken, ' : '';

    return `const express = require('express');
const router = express.Router();
${requireAuth}const ${routeInfo.routeName}Service = require('../services/${routeInfo.routeName}Service');

// GET all ${routeInfo.routeName}
router.get('/', ${authMiddleware}${routeInfo.routeName}Service.getAll);

// GET single ${routeInfo.routeName} by ID
router.get('/:id', ${authMiddleware}${routeInfo.routeName}Service.getById);

// POST create new ${routeInfo.routeName}
router.post('/', ${authMiddleware}${routeInfo.routeName}Service.create);

// PUT update ${routeInfo.routeName}
router.put('/:id', ${authMiddleware}${routeInfo.routeName}Service.update);

// DELETE ${routeInfo.routeName}
router.delete('/:id', ${authMiddleware}${routeInfo.routeName}Service.delete);

module.exports = router;
`;
}

function generateServiceFile(routeInfo) {
    const capitalizedName = routeInfo.routeName.charAt(0).toUpperCase() + routeInfo.routeName.slice(1);

    return `// Import your database models here
// Example: const { YOUR_DB } = require('../Models');
// const { ${capitalizedName} } = YOUR_DB;

/**
 * Get all ${routeInfo.routeName}
 */
exports.getAll = async (req, res) => {
    try {
        // TODO: Implement your logic to fetch all ${routeInfo.routeName}
        // Example:
        // const items = await ${capitalizedName}.findAll();
        // res.json(items);

        res.json({
            message: 'Get all ${routeInfo.routeName} - To be implemented',
            data: []
        });
    } catch (error) {
        console.error('Error fetching ${routeInfo.routeName}:', error);
        res.status(500).json({ message: 'Error fetching ${routeInfo.routeName}', error: error.message });
    }
};

/**
 * Get ${routeInfo.routeName} by ID
 */
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // TODO: Implement your logic to fetch ${routeInfo.routeName} by ID
        // Example:
        // const item = await ${capitalizedName}.findByPk(id);
        // if (!item) {
        //     return res.status(404).json({ message: '${capitalizedName} not found' });
        // }
        // res.json(item);

        res.json({
            message: \`Get ${routeInfo.routeName} with ID \${id} - To be implemented\`,
            data: { id }
        });
    } catch (error) {
        console.error('Error fetching ${routeInfo.routeName}:', error);
        res.status(500).json({ message: 'Error fetching ${routeInfo.routeName}', error: error.message });
    }
};

/**
 * Create new ${routeInfo.routeName}
 */
exports.create = async (req, res) => {
    try {
        const data = req.body;
        
        // TODO: Implement your logic to create ${routeInfo.routeName}
        // Example:
        // const newItem = await ${capitalizedName}.create(data);
        // res.status(201).json(newItem);

        res.status(201).json({
            message: 'Create ${routeInfo.routeName} - To be implemented',
            data: data
        });
    } catch (error) {
        console.error('Error creating ${routeInfo.routeName}:', error);
        res.status(500).json({ message: 'Error creating ${routeInfo.routeName}', error: error.message });
    }
};

/**
 * Update ${routeInfo.routeName}
 */
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        // TODO: Implement your logic to update ${routeInfo.routeName}
        // Example:
        // const item = await ${capitalizedName}.findByPk(id);
        // if (!item) {
        //     return res.status(404).json({ message: '${capitalizedName} not found' });
        // }
        // await item.update(data);
        // res.json(item);

        res.json({
            message: \`Update ${routeInfo.routeName} with ID \${id} - To be implemented\`,
            data: { id, ...data }
        });
    } catch (error) {
        console.error('Error updating ${routeInfo.routeName}:', error);
        res.status(500).json({ message: 'Error updating ${routeInfo.routeName}', error: error.message });
    }
};

/**
 * Delete ${routeInfo.routeName}
 */
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        
        // TODO: Implement your logic to delete ${routeInfo.routeName}
        // Example:
        // const item = await ${capitalizedName}.findByPk(id);
        // if (!item) {
        //     return res.status(404).json({ message: '${capitalizedName} not found' });
        // }
        // await item.destroy();
        // res.json({ message: '${capitalizedName} deleted successfully' });

        res.json({
            message: \`Delete ${routeInfo.routeName} with ID \${id} - To be implemented\`,
            data: { id }
        });
    } catch (error) {
        console.error('Error deleting ${routeInfo.routeName}:', error);
        res.status(500).json({ message: 'Error deleting ${routeInfo.routeName}', error: error.message });
    }
};
`;
}

async function updateRoutesIndex(routesDir, routeInfo) {
    const indexPath = path.join(routesDir, "index.js");
    let content = await fs.readFile(indexPath, "utf8");

    const requireStatement = `const ${routeInfo.routeName}Routes = require('./${routeInfo.routeName}Routes');\n`;
    const authMiddleware = routeInfo.needsAuth ? 'authenticateToken, ' : '';
    const useStatement = `router.use('${routeInfo.routePath}', ${authMiddleware}${routeInfo.routeName}Routes);\n`;

    // Find where to insert require statement (after last require or at top)
    const lastRequireMatch = content.match(/const.*require\(.*\);/g);
    if (lastRequireMatch) {
        const lastRequire = lastRequireMatch[lastRequireMatch.length - 1];
        const requireIndex = content.lastIndexOf(lastRequire) + lastRequire.length;
        content = content.slice(0, requireIndex) + '\n' + requireStatement + content.slice(requireIndex);
    } else {
        // Insert after the router definition
        const routerMatch = content.match(/const router = express\.Router\(\);/);
        if (routerMatch) {
            const routerIndex = content.indexOf(routerMatch[0]) + routerMatch[0].length;
            content = content.slice(0, routerIndex) + '\n\n' + requireStatement + content.slice(routerIndex);
        }
    }

    // Find where to insert use statement (before module.exports)
    const exportsMatch = content.match(/module\.exports = router;/);
    if (exportsMatch) {
        const exportsIndex = content.indexOf(exportsMatch[0]);
        content = content.slice(0, exportsIndex) + useStatement + '\n' + content.slice(exportsIndex);
    } else {
        // Just append at the end
        content += '\n' + useStatement;
    }

    await fs.writeFile(indexPath, content);
}
