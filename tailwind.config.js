/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                // Cores do sistema
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
                // Cores das classes de desbravadores
                class: {
                    amigo: '#FF0000',
                    companheiro: '#0000FF',
                    pesquisador: '#00FF00',
                    pioneiro: '#FFFF00',
                    excursionista: '#800080',
                    guia: '#FFA500',
                },
                // Cores dos tipos de especialidades
                specialty: {
                    ciencia: '#0066CC',
                    artes: '#CC0000',
                    missionarias: '#00CC00',
                    recreativas: '#FF9900',
                    natureza: '#009900',
                    domesticas: '#9900CC',
                }
            },
        },
    },
    plugins: [],
}
