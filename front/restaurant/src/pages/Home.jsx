import React, { useEffect, useState } from 'react'
import ItemComponent from "../components/ItemComponent";


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


  async function handleAddToList(item) {
    if (!currentUser || !isAuthenticated) {
      alert('Você precisa estar logado para adicionar itens ao carrinho!');
      return;
    }

    try {
      // Verificar se o item já existe no carrinho
      const currentCart = currentUser.carrrinho || [];
      const itemExists = currentCart.some(cartItem => cartItem.id === item.id);

      if (itemExists) {
        alert('Este item já está no seu carrinho!');
        return;
      }

      // Usar o novo endpoint específico para carrinho
      const response = await fetch(`${API_URL}/users/${currentUser.id}/carrinho/${item.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const userUpdated = await response.json();

        // Atualizar o estado local
        setCurrentUser(userUpdated);

        // Atualizar o localStorage também
        const storedUser = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({
          ...storedUser,
          carrrinho: userUpdated.carrrinho
        }));

        // Feedback para o usuário
        alert(`${item.name} foi adicionado ao seu carrinho!`);
        console.log('✅ Item adicionado ao carrinho:', item.name);

      } else {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

    } catch (error) {
      console.error('Erro ao adicionar item ao carrinho:', error);
      alert('Erro ao adicionar item ao carrinho. Tente novamente.');
    }
  }



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


      <div className="containerItem">
        <ItemComponent
          items={items.filter((item) => item.type === "HAMBURGUER")}
          handleAddToList={handleAddToList}
        />
      </div>

      <div className="itemCabecalho">
        <h1>Acompanhamentos</h1>
        <a href="/hamburguers">Ver tudo</a>
      </div>

      <div className="containerItem">
        <ItemComponent
          items={items.filter((item) => item.type === "SIDEDISH")}
          handleAddToList={handleAddToList}
        />
      </div>

    </div>
  )
}

export default Home