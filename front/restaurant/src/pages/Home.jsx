import React, { useEffect, useState } from 'react'

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [name, setName] = useState('');
  
     useEffect(() => {
        const storedUser = localStorage.getItem('user');
    
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
    
            fetch(`http://localhost:8080/api/users`)
              .then((res) => {
                return res.json();
              })
              .then((allUsers) => {
                const fullUser = allUsers.find(user => user.id === parsedUser.id);
    
                if (fullUser) {
                  console.log('👤 Usuário encontrado:', fullUser);
                  console.log('📋 Detalhes do usuário:');
                  console.log('  - ID:', fullUser.id);
                  console.log('  - Nome:', fullUser.name);
                  console.log('  - Email:', fullUser.email);
                  console.log('  - Role:', fullUser.role);
                  console.log('  - É Admin?', fullUser.role === 'ADMIN');
    
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
          } catch (parseError) {
            localStorage.removeItem("user");
          }
        } else {
          console.log('❌ Nenhum usuário encontrado no localStorage');
        }
      }, []);

  return (
    <div>
      <h1>Home</h1>
    </div>
  )
}

export default Home
