import Header from '@/components/Header';
import Button from '@/components/ui/Button';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header variant="primary" />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-2 text-gray-600">Bem-vindo ao sistema de gestão Fanation</p>
                </div>

                {/* Cards de funcionalidades */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Gerenciar Recortes</h3>
                        <p className="text-gray-600 mb-4">Cadastre e gerencie os recortes dos seus modelos</p>
                        <Button className="w-full">Acessar</Button>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Visualizar Modelos</h3>
                        <p className="text-gray-600 mb-4">Veja como ficam os modelos montados</p>
                        <Button className="w-full">Acessar</Button>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Upload de Imagens</h3>
                        <p className="text-gray-600 mb-4">Faça upload das imagens dos recortes</p>
                        <Button className="w-full">Acessar</Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
