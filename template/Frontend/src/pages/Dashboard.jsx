import { useTheme } from '../contexts/ThemeContext';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

const Dashboard = () => {
    const { isDark } = useTheme();

    const initialNodes = [
        // Row 1: Frontend Entry & Setup
        {
            id: 'browser',
            type: 'input',
            data: { label: '🌐 User Interaction\nBrowser Request' },
            position: { x: 50, y: 20 },
            style: {
                background: isDark ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: '2px solid #4c51bf',
                borderRadius: '12px',
                padding: '20px',
                fontSize: '16px',
                fontWeight: '600',
                width: 200,
                minHeight: '90px',
            },
        },
        {
            id: 'app',
            data: { label: '📱 App.jsx\nApplication Root\nMounts Providers' },
            position: { x: 300, y: 20 },
            style: {
                background: isDark ? '#1e293b' : '#f8fafc',
                color: isDark ? '#e2e8f0' : '#334155',
                border: `2px solid ${isDark ? '#475569' : '#cbd5e1'}`,
                borderRadius: '12px',
                padding: '18px',
                fontSize: '15px',
                fontWeight: '500',
                width: 200,
                minHeight: '90px',
            },
        },
        {
            id: 'providers',
            data: { label: '🔧 Context Providers\nAuth + Theme State\nWraps All Components' },
            position: { x: 550, y: 20 },
            style: {
                background: isDark ? '#1e293b' : '#f8fafc',
                color: isDark ? '#e2e8f0' : '#334155',
                border: `2px solid ${isDark ? '#475569' : '#cbd5e1'}`,
                borderRadius: '12px',
                padding: '18px',
                fontSize: '14px',
                fontWeight: '500',
                width: 200,
                minHeight: '90px',
            },
        },
        {
            id: 'router',
            data: { label: '🛣️ React Router\nRoute Matching\nURL → Component' },
            position: { x: 800, y: 20 },
            style: {
                background: isDark ? '#1e293b' : '#f8fafc',
                color: isDark ? '#e2e8f0' : '#334155',
                border: `2px solid ${isDark ? '#475569' : '#cbd5e1'}`,
                borderRadius: '12px',
                padding: '18px',
                fontSize: '14px',
                fontWeight: '500',
                width: 200,
                minHeight: '90px',
            },
        },
        {
            id: 'protected',
            data: { label: '🛡️ ProtectedRoute\nAuth Verification\nRedirect if Not Logged' },
            position: { x: 1050, y: 20 },
            style: {
                background: isDark ? '#422006' : '#fef3c7',
                color: isDark ? '#fbbf24' : '#92400e',
                border: `2px solid ${isDark ? '#f59e0b' : '#fbbf24'}`,
                borderRadius: '12px',
                padding: '18px',
                fontSize: '13px',
                fontWeight: '500',
                width: 200,
                minHeight: '90px',
            },
        },
        {
            id: 'layout',
            data: { label: '📐 Layout Component\nRenders Sidebar\nPage Structure' },
            position: { x: 1300, y: 20 },
            style: {
                background: isDark ? '#0f172a' : '#fff',
                color: isDark ? '#94a3b8' : '#64748b',
                border: `2px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                borderRadius: '12px',
                padding: '18px',
                fontSize: '14px',
                width: 200,
                minHeight: '90px',
            },
        },
        {
            id: 'sidebar',
            data: { label: '📋 Sidebar\nNavigation Links\nRoute Selection' },
            position: { x: 1300, y: 160 },
            style: {
                background: isDark ? '#0f172a' : '#fff',
                color: isDark ? '#94a3b8' : '#64748b',
                border: `2px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                borderRadius: '12px',
                padding: '18px',
                fontSize: '13px',
                width: 200,
                minHeight: '80px',
            },
        },
        {
            id: 'pages',
            data: { label: '📄 Page Components\nDashboard/Settings\nRender UI + Logic' },
            position: { x: 1550, y: 20 },
            style: {
                background: isDark ? '#0f172a' : '#fff',
                color: isDark ? '#94a3b8' : '#64748b',
                border: `2px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                borderRadius: '12px',
                padding: '18px',
                fontSize: '14px',
                width: 200,
                minHeight: '90px',
            },
        },

        // Row 2: API & Encryption Layer
        {
            id: 'encryption',
            data: { label: '🔒 CryptoJS Encrypt\nEncrypt Credentials\nBefore API Call' },
            position: { x: 1050, y: 300 },
            style: {
                background: isDark ? '#134e4a' : '#ccfbf1',
                color: isDark ? '#5eead4' : '#115e59',
                border: `2px solid ${isDark ? '#14b8a6' : '#5eead4'}`,
                borderRadius: '12px',
                padding: '18px',
                fontSize: '13px',
                width: 200,
                minHeight: '80px',
            },
        },
        {
            id: 'axios',
            data: { label: '🌐 Axios Instances\nAPI Client Setup\nBase URL + Config' },
            position: { x: 1550, y: 160 },
            style: {
                background: isDark ? '#134e4a' : '#ccfbf1',
                color: isDark ? '#5eead4' : '#115e59',
                border: `2px solid ${isDark ? '#14b8a6' : '#5eead4'}`,
                borderRadius: '12px',
                padding: '18px',
                fontSize: '13px',
                width: 200,
                minHeight: '80px',
            },
        },
        {
            id: 'interceptors',
            data: { label: '⚙️ Request Interceptors\nAttach JWT Token\nHandle 401 Errors' },
            position: { x: 1550, y: 300 },
            style: {
                background: isDark ? '#134e4a' : '#ccfbf1',
                color: isDark ? '#5eead4' : '#115e59',
                border: `2px solid ${isDark ? '#14b8a6' : '#5eead4'}`,
                borderRadius: '12px',
                padding: '18px',
                fontSize: '13px',
                width: 200,
                minHeight: '80px',
            },
        },

        // Row 3: Backend Entry & Routing
        {
            id: 'backend',
            data: { label: '🖥️ Express Server\nEntry Point\nserver.js' },
            position: { x: 50, y: 480 },
            style: {
                background: isDark ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: '#fff',
                border: '2px solid #ec4899',
                borderRadius: '12px',
                padding: '20px',
                fontSize: '16px',
                fontWeight: '600',
                width: 200,
                minHeight: '90px',
            },
        },
        {
            id: 'mainRouter',
            data: { label: '🔀 Main API Router\nRoute Distribution\napp.use("/api", ...)' },
            position: { x: 300, y: 480 },
            style: {
                background: isDark ? '#1e1b4b' : '#f5f3ff',
                color: isDark ? '#c4b5fd' : '#5b21b6',
                border: `2px solid ${isDark ? '#6366f1' : '#c4b5fd'}`,
                borderRadius: '12px',
                padding: '18px',
                fontSize: '14px',
                width: 200,
                minHeight: '90px',
            },
        },
        {
            id: 'authMiddleware',
            data: { label: '🛡️ Auth Middleware\nVerify JWT Token\nProtect Routes' },
            position: { x: 550, y: 340 },
            style: {
                background: isDark ? '#422006' : '#fef3c7',
                color: isDark ? '#fbbf24' : '#92400e',
                border: `2px solid ${isDark ? '#f59e0b' : '#fbbf24'}`,
                borderRadius: '12px',
                padding: '18px',
                fontSize: '13px',
                fontWeight: '500',
                width: 200,
                minHeight: '80px',
            },
        },
        {
            id: 'authRoutes',
            data: { label: '🔑 Auth Routes\n/api/auth/*\nLogin/Register/Logout' },
            position: { x: 550, y: 480 },
            style: {
                background: isDark ? '#18181b' : '#fafafa',
                color: isDark ? '#a1a1aa' : '#52525b',
                border: `2px solid ${isDark ? '#52525b' : '#d4d4d8'}`,
                borderRadius: '12px',
                padding: '18px',
                fontSize: '13px',
                width: 200,
                minHeight: '90px',
            },
        },
        {
            id: 'dashRoutes',
            data: { label: '📊 Dashboard Routes\n/api/dash/*\nGet Dashboard Data' },
            position: { x: 800, y: 480 },
            style: {
                background: isDark ? '#18181b' : '#fafafa',
                color: isDark ? '#a1a1aa' : '#52525b',
                border: `2px solid ${isDark ? '#52525b' : '#d4d4d8'}`,
                borderRadius: '12px',
                padding: '18px',
                fontSize: '13px',
                width: 200,
                minHeight: '90px',
            },
        },
        {
            id: 'settingsRoutes',
            data: { label: '⚙️ Settings Routes\n/api/settings/*\nUpdate User Settings' },
            position: { x: 1050, y: 480 },
            style: {
                background: isDark ? '#18181b' : '#fafafa',
                color: isDark ? '#a1a1aa' : '#52525b',
                border: `2px solid ${isDark ? '#52525b' : '#d4d4d8'}`,
                borderRadius: '12px',
                padding: '18px',
                fontSize: '13px',
                width: 200,
                minHeight: '90px',
            },
        },

        // Row 4: Business Logic Services
        {
            id: 'cryptoService',
            data: { label: '🔓 Crypto Service\nDecrypt Credentials\nCryptoJS Decrypt' },
            position: { x: 300, y: 620 },
            style: {
                background: isDark ? '#422006' : '#fef3c7',
                color: isDark ? '#fbbf24' : '#92400e',
                border: `2px solid ${isDark ? '#f59e0b' : '#fbbf24'}`,
                borderRadius: '12px',
                padding: '18px',
                fontSize: '13px',
                width: 200,
                minHeight: '80px',
            },
        },
        {
            id: 'authService',
            data: { label: '🔐 Auth Service\nBcrypt Password Hash\nJWT Token Generation' },
            position: { x: 550, y: 620 },
            style: {
                background: isDark ? '#1c1917' : '#fafaf9',
                color: isDark ? '#d6d3d1' : '#57534e',
                border: `2px solid ${isDark ? '#78716c' : '#d6d3d1'}`,
                borderRadius: '12px',
                padding: '18px',
                fontSize: '13px',
                width: 200,
                minHeight: '80px',
            },
        },
        {
            id: 'dashService',
            data: { label: '📊 Dashboard Service\nBusiness Logic\nData Processing' },
            position: { x: 800, y: 620 },
            style: {
                background: isDark ? '#1c1917' : '#fafaf9',
                color: isDark ? '#d6d3d1' : '#57534e',
                border: `2px solid ${isDark ? '#78716c' : '#d6d3d1'}`,
                borderRadius: '12px',
                padding: '18px',
                fontSize: '13px',
                width: 200,
                minHeight: '80px',
            },
        },
        {
            id: 'settingsService',
            data: { label: '⚙️ Settings Service\nBusiness Logic\nUpdate Operations' },
            position: { x: 1050, y: 620 },
            style: {
                background: isDark ? '#1c1917' : '#fafaf9',
                color: isDark ? '#d6d3d1' : '#57534e',
                border: `2px solid ${isDark ? '#78716c' : '#d6d3d1'}`,
                borderRadius: '12px',
                padding: '18px',
                fontSize: '13px',
                width: 200,
                minHeight: '80px',
            },
        },

        // Row 5: Database Layer
        {
            id: 'models',
            data: { label: '📦 Sequelize Models\nORM Definitions\nUser/Post/etc Tables' },
            position: { x: 1300, y: 620 },
            style: {
                background: isDark ? 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                border: '2px solid #4c51bf',
                borderRadius: '12px',
                padding: '20px',
                fontSize: '14px',
                fontWeight: '600',
                width: 200,
                minHeight: '90px',
            },
        },
        {
            id: 'dbConfig',
            data: { label: '⚙️ DB Config\nConnection Settings\ndbConfigs.js' },
            position: { x: 1300, y: 480 },
            style: {
                background: isDark ? '#171717' : '#f5f5f5',
                color: isDark ? '#a3a3a3' : '#525252',
                border: `2px solid ${isDark ? '#525252' : '#a3a3a3'}`,
                borderRadius: '12px',
                padding: '18px',
                fontSize: '13px',
                width: 200,
                minHeight: '80px',
            },
        },
        {
            id: 'dbInit',
            data: { label: '🚀 DB Initialization\nConnect + Sync\nRun on Server Start' },
            position: { x: 50, y: 620 },
            style: {
                background: isDark ? '#171717' : '#f5f5f5',
                color: isDark ? '#a3a3a3' : '#525252',
                border: `2px solid ${isDark ? '#525252' : '#a3a3a3'}`,
                borderRadius: '12px',
                padding: '18px',
                fontSize: '13px',
                width: 200,
                minHeight: '80px',
            },
        },
        {
            id: 'database',
            type: 'output',
            data: { label: '💾 Database\nPostgres/MySQL\nPersistent Storage' },
            position: { x: 1550, y: 620 },
            style: {
                background: isDark ? 'linear-gradient(135deg, #134e4a 0%, #065f46 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                border: '2px solid #059669',
                borderRadius: '12px',
                padding: '20px',
                fontSize: '16px',
                fontWeight: '600',
                width: 200,
                minHeight: '90px',
            },
        },
    ];

    const initialEdges = [
        // ===== FRONTEND FLOW =====
        // Main component hierarchy flow
        { id: 'e1', source: 'browser', target: 'app', animated: true, style: { stroke: '#667eea', strokeWidth: 3 }, label: 'Load App' },
        { id: 'e2', source: 'app', target: 'providers', animated: true, style: { stroke: '#667eea', strokeWidth: 3 }, label: 'Mount' },
        { id: 'e3', source: 'providers', target: 'router', animated: true, style: { stroke: '#667eea', strokeWidth: 3 }, label: 'Wrap' },
        { id: 'e4', source: 'router', target: 'protected', animated: true, style: { stroke: '#667eea', strokeWidth: 3 }, label: 'Route' },
        { id: 'e5', source: 'protected', target: 'layout', animated: true, style: { stroke: '#f59e0b', strokeWidth: 3 }, label: 'Auth ✓' },
        { id: 'e6', source: 'layout', target: 'sidebar', style: { stroke: '#94a3b8', strokeWidth: 2 }, label: 'Contains' },
        { id: 'e7', source: 'layout', target: 'pages', animated: true, style: { stroke: '#667eea', strokeWidth: 3 }, label: 'Render' },

        // Sidebar navigation
        { id: 'e8', source: 'sidebar', target: 'pages', style: { stroke: '#94a3b8', strokeWidth: 2 }, label: 'Navigate', type: 'smoothstep' },

        // ===== API CALL FLOW =====
        // Pages to Axios
        { id: 'e9', source: 'pages', target: 'axios', animated: true, style: { stroke: '#14b8a6', strokeWidth: 3 }, label: 'API Call' },
        { id: 'e10', source: 'axios', target: 'interceptors', animated: true, style: { stroke: '#14b8a6', strokeWidth: 3 }, label: 'Process' },

        // Encryption flow (for login/register)
        { id: 'e11', source: 'protected', target: 'encryption', style: { stroke: '#14b8a6', strokeWidth: 2 }, label: 'Encrypt Data', type: 'smoothstep' },
        { id: 'e12', source: 'encryption', target: 'axios', style: { stroke: '#14b8a6', strokeWidth: 2 }, label: 'Encrypted', type: 'smoothstep' },

        // Interceptors to Backend
        { id: 'e13', source: 'interceptors', target: 'backend', animated: true, style: { stroke: '#ec4899', strokeWidth: 4 }, label: 'HTTP Request', type: 'smoothstep' },

        // ===== BACKEND FLOW =====
        // Server initialization
        { id: 'e14', source: 'backend', target: 'dbInit', style: { stroke: '#525252', strokeWidth: 2 }, label: 'Initialize', type: 'smoothstep' },
        { id: 'e15', source: 'backend', target: 'mainRouter', animated: true, style: { stroke: '#ec4899', strokeWidth: 3 }, label: 'Route to /api' },

        // Main Router distribution
        { id: 'e16', source: 'mainRouter', target: 'authRoutes', animated: true, style: { stroke: '#6366f1', strokeWidth: 3 }, label: '/auth' },
        { id: 'e17', source: 'mainRouter', target: 'dashRoutes', animated: true, style: { stroke: '#6366f1', strokeWidth: 3 }, label: '/dash' },
        { id: 'e18', source: 'mainRouter', target: 'settingsRoutes', animated: true, style: { stroke: '#6366f1', strokeWidth: 3 }, label: '/settings' },

        // Auth Middleware checks
        { id: 'e19', source: 'mainRouter', target: 'authMiddleware', style: { stroke: '#f59e0b', strokeWidth: 2 }, label: 'Check Auth' },
        { id: 'e20', source: 'authMiddleware', target: 'dashRoutes', style: { stroke: '#f59e0b', strokeWidth: 2 }, label: 'Authorize', type: 'smoothstep' },
        { id: 'e21', source: 'authMiddleware', target: 'settingsRoutes', style: { stroke: '#f59e0b', strokeWidth: 2 }, label: 'Authorize', type: 'smoothstep' },

        // ===== SERVICES LAYER =====
        // Routes to Services
        { id: 'e22', source: 'authRoutes', target: 'cryptoService', style: { stroke: '#f59e0b', strokeWidth: 2 }, label: 'Decrypt' },
        { id: 'e23', source: 'cryptoService', target: 'authService', animated: true, style: { stroke: '#78716c', strokeWidth: 3 }, label: 'Process' },
        { id: 'e24', source: 'authRoutes', target: 'authService', animated: true, style: { stroke: '#78716c', strokeWidth: 3 }, label: 'Handle' },
        { id: 'e25', source: 'dashRoutes', target: 'dashService', animated: true, style: { stroke: '#78716c', strokeWidth: 3 }, label: 'Handle' },
        { id: 'e26', source: 'settingsRoutes', target: 'settingsService', animated: true, style: { stroke: '#78716c', strokeWidth: 3 }, label: 'Handle' },

        // ===== DATABASE LAYER =====
        // Services to Models
        { id: 'e27', source: 'authService', target: 'models', animated: true, style: { stroke: '#4c51bf', strokeWidth: 3 }, label: 'Query' },
        { id: 'e28', source: 'dashService', target: 'models', animated: true, style: { stroke: '#4c51bf', strokeWidth: 3 }, label: 'Query' },
        { id: 'e29', source: 'settingsService', target: 'models', animated: true, style: { stroke: '#4c51bf', strokeWidth: 3 }, label: 'Query' },

        // Models configuration
        { id: 'e30', source: 'models', target: 'dbConfig', style: { stroke: '#525252', strokeWidth: 2 }, label: 'Use Config' },
        { id: 'e31', source: 'dbConfig', target: 'database', style: { stroke: '#10b981', strokeWidth: 2 }, label: 'Connect' },
        { id: 'e32', source: 'models', target: 'database', animated: true, style: { stroke: '#10b981', strokeWidth: 3 }, label: 'Execute SQL' },

        // DB initialization
        { id: 'e33', source: 'dbInit', target: 'dbConfig', style: { stroke: '#525252', strokeWidth: 2 }, label: 'Load' },
        { id: 'e34', source: 'dbInit', target: 'models', style: { stroke: '#525252', strokeWidth: 2 }, label: 'Sync Tables' },
    ];


    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-[#0a0a0a]" : "bg-[#fafafa]"}`}>
            <div className="h-screen flex flex-col">
                {/* Header */}
                <div className="px-6 py-6">
                    <h1 className={`text-4xl sm:text-5xl font-semibold mb-2 tracking-tight
                        ${isDark ? "text-white" : "text-gray-900"}`}
                        style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}>
                        Application Flow
                    </h1>
                    <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        Interactive visualization of the full-stack architecture
                    </p>
                </div>

                {/* Flow Diagram */}
                <div className={`flex-1 ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'} rounded-xl mx-6 mb-6 border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        fitView
                        attributionPosition="bottom-left"
                    >
                        <Background color={isDark ? '#1f2937' : '#e5e7eb'} gap={16} />
                        <Controls className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} />
                        <MiniMap
                            nodeColor={(node) => {
                                if (node.type === 'input') return '#667eea';
                                if (node.type === 'output') return '#10b981';
                                return isDark ? '#1e293b' : '#f8fafc';
                            }}
                            maskColor={isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)'}
                            className={isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}
                        />
                    </ReactFlow>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;