import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/users');
            const data = await response.json();
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email }),
            });
            const newUser = await response.json();
            setUsers([...users, newUser]);
            setName('');
            setEmail('');
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
        }
    };

    if (loading) {
        return <div className="App">Carregando...</div>;
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>🚀 Spring Boot + React</h1>
                <p>Integração funcionando!</p>
            </header>

            <div className="container">
                <section className="users-section">
                    <h2>📋 Lista de Usuários</h2>
                    <div className="users-grid">
                        {users.map((user) => (
                            <div key={user.id} className="user-card">
                                <h3>{user.name}</h3>
                                <p>{user.email}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="form-section">
                    <h2>➕ Adicionar Novo Usuário</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit">Adicionar</button>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default App;
