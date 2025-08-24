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
                setIsAuthenticated(true);
                setIsAdmin(parsedUser.role === 'ADMIN');
                setName(parsedUser.name || '');
                setUserId(parsedUser.id || null); // 👈 salva o ID
                setListFavorites(parsedUser.carrinho || []); // 👈 carrega o carrinho
            } catch (err) {
                console.error("Erro ao processar usuário do localStorage", err);
            }
        }
    }, []);



    const removeFromCart = async (itemId) => {
        console.log('🗑️ Tentando remover item com ID:', itemId);
        console.log('👤 ID do usuário:', userId);

        try {
            // Remove do estado local primeiro (para UX mais rápida)
            const originalCart = [...listFavorites]; // Salva o estado original
            const updatedCart = listFavorites.filter(item => item.id !== itemId);
            setListFavorites(updatedCart);

            const response = await fetch(`http://localhost:8080/api/users/${userId}/carrinho/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('📡 Status da resposta:', response.status);

            if (!response.ok) {
                // Se a requisição falhar, reverte o estado local
                console.error('❌ Erro ao remover item do carrinho - Status:', response.status);
                setListFavorites(originalCart); // Reverte para o estado original
                alert(`Erro ao remover item do carrinho (${response.status})`);
            } else {
                // Verifica se realmente foi removido no backend
                const updatedUser = await response.json();
                console.log('✅ Resposta do servidor:', updatedUser);
                console.log('📦 Carrinho atualizado no servidor:', updatedUser.carrinho);

                // Atualiza com os dados reais do servidor
                setListFavorites(updatedUser.carrinho || []);

                // Atualiza o localStorage também
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    try {
                        const parsedUser = JSON.parse(storedUser);
                        const updatedUserData = {
                            ...parsedUser,
                            carrinho: updatedUser.carrinho || []
                        };
                        localStorage.setItem('user', JSON.stringify(updatedUserData));
                        console.log('💾 localStorage atualizado');
                    } catch (error) {
                        console.error('❌ Erro ao atualizar localStorage:', error);
                    }
                }

                console.log('🎉 Item removido do carrinho com sucesso!');
            }
        } catch (error) {
            // Se houver erro, reverte o estado local
            console.error('❌ Erro ao remover item:', error);
            setListFavorites(originalCart); // Reverte para o estado original
            alert('Erro de conexão ao remover item do carrinho');
        }
    };

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