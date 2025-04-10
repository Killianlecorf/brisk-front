import React, { useState, useEffect } from 'react';
import request from './utils/request';

interface User {
  _id: string;
  username: string;
  email: string;
}

function App() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<{ username: string; email: string }>({ username: '', email: '' });
  const [editUser, setEditUser] = useState<{ id: string; username: string; email: string }>({
    id: '',
    username: '',
    email: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await request('', 'GET');
      if (response.ok) {
        setData(response.data);
        setLoading(false);
      } else {
        setError(response.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    const response = await request(`${id}`, 'DELETE');
    if (response.ok) {
      setData(data.filter((user) => user._id !== id)); 
    } else {
      setError('Erreur lors de la suppression');
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = { ...newUser };

    const response = await request('', 'POST', user);
    if (response.ok) {
      setData((prevData) => [...prevData, response.data]);
      setNewUser({ username: '', email: '' });
    } else {
      setError('Erreur lors de l\'ajout de l\'utilisateur');
    }
  };

  const handleEditUser = async (e: React.FormEvent, id: string) => {
    e.preventDefault();

    const updatedUser = { ...editUser };

    const response = await request(`${id}`, 'PUT', updatedUser);
    if (response.ok) {
      setData((prevData) =>
        prevData.map((user) =>
          user._id === id ? { ...user, username: response.data.username, email: response.data.email } : user
        )
      );
      setEditUser({ id: '', username: '', email: '' });
    } else {
      setError('Erreur lors de la mise à jour de l\'utilisateur');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div>
      <h1>To-Do List - Utilisateurs</h1>
      
      <form onSubmit={handleAddUser}>
        <input
          type="text"
          name="username"
          placeholder="Nom d'utilisateur"
          value={newUser.username}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleInputChange}
        />
        <button type="submit">Ajouter</button>
      </form>

      {editUser.id && (
        <form onSubmit={(e) => handleEditUser(e, editUser.id)}>
          <input
            type="text"
            name="username"
            placeholder="Nouveau Nom d'utilisateur"
            value={editUser.username}
            onChange={handleEditInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Nouveau Email"
            value={editUser.email}
            onChange={handleEditInputChange}
          />
          <button type="submit">Mettre à jour</button>
        </form>
      )}

      <ul>
        {data.map((user) => (
          <li key={user._id}>
            <div>
              <h3>{user.username}</h3>
              <p>Email: {user.email}</p>
              <button onClick={() => handleDelete(user._id)}>Supprimer</button>
              <button
                onClick={() =>
                  setEditUser({
                    id: user._id,
                    username: user.username,
                    email: user.email,
                  })
                }
              >
                Modifier
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
