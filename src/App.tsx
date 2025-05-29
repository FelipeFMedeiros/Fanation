// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
// Routes
import AppRoutes from './router/AppRoutes';

function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </ToastProvider>
    );
}

export default App;
