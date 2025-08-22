import React, { useEffect, useState } from 'react'

const Cart = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [name, setName] = useState('');
    const [listFavorites, setListFavorites] = useState([]);
    const [userId, setUserId] = useState(null);

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
                            setListFavorites(fullUser.carrinho || []); // Corrigido: carrinho
                            setUserId(fullUser.id);
                        } else {
                            localStorage.removeItem("user");
                            setIsAuthenticated(false);
                            setIsAdmin(false);
                            setName('');
                        }
                    })
                    .catch((error) => {
                        console.error('Error fetching users:', error);
                        localStorage.removeItem("user");
                        setIsAuthenticated(false);
                        setIsAdmin(false);
                        setName('');
                    });
            } catch (parseError) {
                console.error('Error parsing user data:', parseError);
                localStorage.removeItem("user");
            }
        } else {
            console.log('❌ Nenhum usuário encontrado no localStorage');
        }
    }, []);

    const removeFromCart = async (itemId) => {
        console.log('🗑️ Tentando remover item com ID:', itemId);
        
        try {
            const updatedCart = listFavorites.filter(item => item.id !== itemId);
            setListFavorites(updatedCart);

            const response = await fetch(`http://localhost:8080/api/users/${userId}/carrinho/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                // Se a requisição falhar, reverte o estado local
                setListFavorites(listFavorites);
                console.error('Erro ao remover item do carrinho - Status:', response.status);
                alert('Erro ao remover item do carrinho');
            } else {
                console.log('Item removido do carrinho com sucesso');

                // Atualiza o localStorage também
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    try {
                        const parsedUser = JSON.parse(storedUser);
                        const updatedUser = {
                            ...parsedUser,
                            carrinho: updatedCart
                        };
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                    } catch (error) {
                        console.error('Erro ao atualizar localStorage:', error);
                    }
                }
            }
        } catch (error) {
            // Se houver erro, reverte o estado local
            setListFavorites(listFavorites);
            console.error('Erro ao remover item:', error);
            alert('Erro de conexão ao remover item do carrinho');
        }
    };

    // Função para calcular o total do carrinho
    const calculateTotal = () => {
        return listFavorites.reduce((total, item) => {
            const price = parseFloat(item.price) || 0;
            return total + price;
        }, 0).toFixed(2);
    };

    return (
        <div className='cart'>
            {listFavorites.length > 0 ? (
                <div>
                    <div className="headerCart">
                        <img src="https://res.cloudinary.com/dmf7ocduw/image/upload/v1755819838/icons_hbi0j7.png" alt="" />
                        <h1>Seu carrinho</h1>
                    </div>
                    {listFavorites.map((favorite, index) => (
                        <div key={favorite.id || index} className="cartContainer">
                            <div className="cartItem">
                                <img src={favorite.image} alt="" />
                                <div className="productInformation">
                                    <h3>{favorite.name}</h3>
                                    <h3>R$ {favorite.price}</h3>
                                    <h3>Quantidade: 1x</h3>
                                    <div className="removeButton">
                                        <button 
                                            onClick={() => removeFromCart(favorite.id)}
                                            className='buttonRemove'
                                        >
                                            <i className="fa-solid fa-trash-can"></i>
                                            <p>Remover</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <div className="informationsTotal">
                        <h1>Total do Carrinho: R$ {calculateTotal()}</h1>
                        <div className="checkoutButton">
                            <button className="finalizarPedido">
                                Finalizar Pedido
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="headerCart">
                        <img src="https://res.cloudinary.com/dmf7ocduw/image/upload/v1755819838/icons_hbi0j7.png" alt="" />
                        <h1>Seu carrinho</h1>
                    </div>
                    <div className="emptyCart">
                        <p>🛒 Seu carrinho está vazio</p>
                        <p>Adicione alguns deliciosos produtos!</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart