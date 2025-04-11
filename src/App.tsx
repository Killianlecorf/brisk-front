import React, { useState, useEffect } from 'react';

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
    fetch('http://localhost:5253/users')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des utilisateurs');
        }
        return response.json();
      })
      .then((data: User[]) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [data]);

  const handleDelete = (id: string) => {
    fetch(`http://localhost:5253/users/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setData(data.filter((user) => user._id !== id));
      })
      .catch((error) => {
        setError('Erreur lors de la suppression');
      });
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();

    const user = { ...newUser };

    fetch('http://localhost:5253/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data: User) => {
        setData((prevData) => [...prevData, data]);
        setNewUser({ username: '', email: '' });
      })
      .catch((error) => {
        setError('Erreur lors de l\'ajout de l\'utilisateur');
      });
  };

  const handleEditUser = (e: React.FormEvent, id: string) => {
    e.preventDefault();

    const updatedUser = { ...editUser };

    fetch(`http://localhost:5253/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => response.json())
      .then((updatedUserData: User) => {
        setData((prevData) =>
          prevData.map((user) =>
            user._id === id ? { ...user, username: updatedUserData.username, email: updatedUserData.email } : user
          )
        );
        setEditUser({ id: '', username: '', email: '' });
      })
      .catch((error) => {
        setError('Erreur lors de la mise à jour de l\'utilisateur');
      });
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
          type="text"
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
            type="text"
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
