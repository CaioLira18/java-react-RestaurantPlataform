import React, { useEffect, useState } from 'react'
import Item from '../components/Item.jsx';

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState('');
  const [items, setItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const API_URL = "http://localhost:8080/api";

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        fetch(`${API_URL}/users`)
          .then((res) => res.json())
          .then((allUsers) => {
            const fullUser = allUsers.find(user => user.id === parsedUser.id);

            if (fullUser) {
              console.log('👤 Usuário encontrado:', fullUser);
              setCurrentUser(fullUser);
              setIsAuthenticated(true);
              setIsAdmin(fullUser.role === 'ADMIN');
              setName(fullUser.name || '');
            } else {
              localStorage.removeItem("user");
              setIsAuthenticated(false);
              setIsAdmin(false);
              setName('');
            }
          })
          .catch((err) => {
            console.error("Erro ao buscar usuários:", err);
            localStorage.removeItem("user");
            setIsAuthenticated(false);
            setIsAdmin(false);
            setName('');
          });
      } catch (parseError) {
        localStorage.removeItem("user");
      }
    } else {
      console.log('❌ Nenhum usuário encontrado no localStorage');
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetch(`${API_URL}/items`)
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setItems(data))
      .catch((err) => console.error("Erro ao buscar Items", err));
  }, [isAuthenticated]);


  return (
    <div>
      {!isAdmin && (
        <div className="adminButtons">
          <a href="/adicionarItem"><button>Adicionar Produto</button></a>
        </div>
      )}

      <div className="itemCabecalho">
        <h1>Hambúrgueres</h1>
        <a href="/hamburguers">Ver tudo</a>
      </div>
    </div>
  )
}

export default Home