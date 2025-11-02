import React, { useState } from 'react';
import DiscordIcon from './icons/DiscordIcon';

interface EscalationFormProps {
    onSubmit: (details: { discordUsername: string; userQuery: string }) => void;
    onCancel: () => void;
}

const EscalationForm: React.FC<EscalationFormProps> = ({ onSubmit, onCancel }) => {
    const [discordUsername, setDiscordUsername] = useState('');
    const [userQuery, setUserQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!discordUsername || !userQuery) return;

        setIsSubmitting(true);
        // Simulate network request
        setTimeout(() => {
            onSubmit({ discordUsername, userQuery });
            setIsSubmitting(false);
        }, 500);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-base-200 p-8 rounded-lg shadow-xl w-full max-w-md relative">
                <h2 className="text-2xl font-bold mb-4 text-center">Falar com um Agente</h2>
                <div className="flex items-center justify-center gap-3 p-3 rounded-md bg-base-300 mb-6">
                    <DiscordIcon className="w-8 h-8 text-[#5865F2] flex-shrink-0" />
                    <p className="text-xs text-gray-300">
                        Nossa equipe de suporte entrará em contato com você via Discord. 
                        <span className="font-bold">Por favor, certifique-se de que você está em nosso servidor.</span>
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="discord" className="block text-sm font-medium text-gray-300">Seu nome de usuário do Discord</label>
                        <input
                            id="discord"
                            type="text"
                            value={discordUsername}
                            onChange={(e) => setDiscordUsername(e.target.value)}
                            placeholder="ex: nome#1234"
                            className="w-full px-3 py-2 mt-1 text-white bg-base-300 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="issue" className="block text-sm font-medium text-gray-300">Resuma sua dúvida</label>
                        <textarea
                            id="issue"
                            value={userQuery}
                            onChange={(e) => setUserQuery(e.target.value)}
                            placeholder="Preciso de ajuda com..."
                            className="w-full px-3 py-2 mt-1 text-white bg-base-300 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                            rows={4}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-end gap-4 pt-4">
                         <button type="button" onClick={onCancel} className="py-2 px-4 rounded-md font-semibold hover:bg-base-300 transition-colors duration-200">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isSubmitting} className="py-2 px-4 bg-brand-secondary hover:bg-brand-primary rounded-md font-semibold text-white transition-colors duration-200 disabled:bg-base-300 disabled:cursor-not-allowed">
                            {isSubmitting ? 'Enviando...' : 'Enviar para Suporte'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EscalationForm;