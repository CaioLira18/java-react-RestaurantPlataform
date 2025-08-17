import React, { useEffect, useState } from 'react'

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState('');
  const [items, setItems] = useState([]);

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
          <button>Adicionar Produto</button>
        </div>
      )}

      <div className="itemCabecalho">
        <h1>Hambúrgueres</h1>
        <a href="/hamburguers">Ver tudo</a>
      </div>
      {items.map((item) => (
        <div key={item.id} className="itemContainer">
          <div className="itemBox">
            <img src={item.image} alt="" />
            <div className="itemInformations">
              <h1>{item.name}</h1>
              <h2>R$ {item.price}</h2>
              <p>{item.description}</p>
            </div>
            <div className="cartButton">
              <button>Adicionar ao Carrinho</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Home
