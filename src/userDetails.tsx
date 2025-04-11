import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './userdetails.css';

interface User {
  _id: string;
  username: string;
  email: string;
}

function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`http://localhost:5253/users/${id}`)
      .then((response) => response.json())
      .then((data: User) => setUser(data))
      .catch((error) => console.error('Erreur:', error));
  }, [id]);

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="user-detail-container">
      <h1>Détails de l'utilisateur</h1>
      <h2>{user.username}</h2>
      <p>Email: {user.email}</p>
      <p>ID: {user._id}</p>
    </div>
  );
}

export default UserDetail;
