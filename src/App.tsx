import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './router/AppRoutes';

function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;
