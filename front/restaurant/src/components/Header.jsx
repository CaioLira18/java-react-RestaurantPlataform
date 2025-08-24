import React, { useEffect, useState } from 'react'

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState('');

  function handleLogOut() {
    console.log('🚪 Fazendo logout...');
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setIsAdmin(false);
    setName('');
    window.location.href = '/';
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === 'ADMIN');
        setName(parsedUser.name || '');
      } catch (err) {
        console.error("Erro ao processar usuário do localStorage", err);
      }
    }
  }, []);


  return (
    <div>
      <div className="header">
        <div className="headerContainer">
          <div className="imageLogoHeader">
            <img src="https://res.cloudinary.com/dmf7ocduw/image/upload/v1755286303/logo_rudejh.png" alt="" />
          </div>
          <div className="optionsHeader">
            <ul>
              <div className="optionIndividual">
                <i className="fa-solid fa-house"></i>
                <li><a href="/">Home</a></li>
              </div>

              {isAdmin && (
                <div className="optionIndividual">
                  <i className="fa-solid fa-clipboard-list"></i>
                  <li><a href="/pedidos">Pedidos</a></li>
                </div>
              )}

              {!isAuthenticated && (
                <div className="optionIndividual">
                  <i className="fa-solid fa-user"></i>
                  <li><a href="/login">Login</a></li>
                </div>
              )}

              {isAuthenticated && (
                <div className="optionIndividual">
                  <i className="fa-solid fa-user"></i>
                  <li><a href="/edit">{name}</a></li>
                </div>
              )}

              {isAuthenticated && (
                <div className="optionIndividual">
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                  <li><a onClick={handleLogOut} style={{ cursor: 'pointer' }}>Sair</a></li>
                </div>
              )}

              <div className="optionIndividual">
                <i className="fa-solid fa-basket-shopping"></i>
                <li><a href="/carrinho">Carrinho</a></li>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
