import React, { useState } from 'react';

interface AdminLoginProps {
    onLoginSuccess: () => void;
    onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBack }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'ADM' && password === 'ADM1019320') {
            setError('');
            onLoginSuccess();
        } else {
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-base-100 text-white p-4">
            <div className="w-full max-w-sm p-8 space-y-6 bg-base-200 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center">Admin Login</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 mt-1 text-white bg-base-300 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password"  className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 text-white bg-base-300 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                            required
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    <button type="submit" className="w-full py-2 px-4 bg-brand-secondary hover:bg-brand-primary rounded-md font-semibold text-white transition-colors duration-200">
                        Login
                    </button>
                </form>
            </div>
             <button onClick={onBack} className="mt-6 text-sm text-brand-secondary hover:underline">
                Back to Chat
            </button>
        </div>
    );
};

export default AdminLogin;
