import React, { useEffect, useState } from 'react'

const Cart = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [name, setName] = useState('');
    const [listFavorites, setListFavorites] = useState([]);
    const [userId, setUserId] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState('PIX');
    const [userCards, setUserCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState('');
    const [showNewCardForm, setShowNewCardForm] = useState(false);

    // Estados do formulário do cartão
    const [cardData, setCardData] = useState({
        numberCard: '',
        dueMonth: '',
        dueYear: '',
        cvv: '',
        type: 'CREDIT'
    });

    const [isSubmittingCard, setIsSubmittingCard] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setIsAuthenticated(true);
                setIsAdmin(parsedUser.role === 'ADMIN');
                setName(parsedUser.name || '');
                setUserId(parsedUser.id || null); 
                setListFavorites(parsedUser.carrinho || []); 
                setUserCards(parsedUser.cards || []);
            } catch (err) {
                console.error("Erro ao processar usuário do localStorage", err);
            }
        }
    }, []);

    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        
        // Formatação específica para cada campo
        let formattedValue = value;
        
        if (name === 'numberCard') {
            // Remove tudo que não é número e adiciona espaços a cada 4 dígitos
            formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
            if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19); // 16 dígitos + 3 espaços
        } else if (name === 'dueMonth') {
            // Apenas números, máximo 2 dígitos
            formattedValue = value.replace(/\D/g, '').slice(0, 2);
        } else if (name === 'dueYear') {
            // Apenas números, máximo 4 dígitos
            formattedValue = value.replace(/\D/g, '').slice(0, 4);
        } else if (name === 'cvv') {
            // Apenas números, máximo 4 dígitos
            formattedValue = value.replace(/\D/g, '').slice(0, 4);
        }

        setCardData(prev => ({
            ...prev,
            [name]: formattedValue
        }));
    };

    const validateCard = () => {
        const { numberCard, dueMonth, dueYear, cvv } = cardData;
        
        // Remove espaços do número do cartão para validação
        const cleanCardNumber = numberCard.replace(/\s/g, '');
        
        if (cleanCardNumber.length !== 16) {
            alert('Número do cartão deve ter 16 dígitos');
            return false;
        }
        
        if (!dueMonth || parseInt(dueMonth) < 1 || parseInt(dueMonth) > 12) {
            alert('Mês de vencimento inválido (01-12)');
            return false;
        }
        
        if (!dueYear || dueYear.length !== 4 || parseInt(dueYear) < new Date().getFullYear()) {
            alert('Ano de vencimento inválido');
            return false;
        }
        
        if (cvv.length < 3 || cvv.length > 4) {
            alert('CVV deve ter 3 ou 4 dígitos');
            return false;
        }
        
        return true;
    };

    const saveCard = async () => {
        if (!validateCard()) return;
        
        setIsSubmittingCard(true);
        
        try {
            // Preparar dados do cartão (remover espaços do número)
            const cardToSave = {
                ...cardData,
                numberCard: cardData.numberCard.replace(/\s/g, ''),
                type: selectedPayment // CREDIT ou DEBIT
            };

            console.log('💳 Salvando cartão:', cardToSave);

            // Salvar o cartão no backend
            const cardResponse = await fetch('http://localhost:8080/api/card', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cardToSave)
            });

            if (!cardResponse.ok) {
                throw new Error(`Erro ao salvar cartão: ${cardResponse.status}`);
            }

            const savedCard = await cardResponse.json();
            console.log('✅ Cartão salvo:', savedCard);

            // Atualizar a lista de cartões do usuário
            setUserCards(prev => [...prev, savedCard]);
            setSelectedCard(savedCard.id);
            setShowNewCardForm(false);

            // Resetar formulário
            setCardData({
                numberCard: '',
                dueMonth: '',
                dueYear: '',
                cvv: '',
                type: 'CREDIT'
            });

            alert('Cartão cadastrado com sucesso!');

        } catch (error) {
            console.error('❌ Erro ao salvar cartão:', error);
            alert('Erro ao cadastrar cartão. Tente novamente.');
        } finally {
            setIsSubmittingCard(false);
        }
    };

    async function addToPedidos() {
        if (listFavorites.length === 0) {
            alert('Carrinho está vazio!');
            return;
        }

        if (!selectedPayment) {
            alert('Selecione uma forma de pagamento!');
            return;
        }

        if ((selectedPayment === 'CREDIT' || selectedPayment === 'DEBIT') && !selectedCard && userCards.length === 0) {
            alert('Cadastre um cartão para finalizar a compra!');
            return;
        }

        // Aqui você implementaria a lógica para criar o pedido
        console.log('🛍️ Finalizando pedido:', {
            items: listFavorites,
            paymentMethod: selectedPayment,
            cardId: selectedCard,
            total: calculateTotal()
        });

        alert('Pedido finalizado com sucesso!');
        // Limpar carrinho após finalizar pedido
        setListFavorites([]);
    }

    const removeFromCart = async (itemId) => {
        console.log('🗑️ Tentando remover item com ID:', itemId);
        console.log('👤 ID do usuário:', userId);

        try {
            const originalCart = [...listFavorites];
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
                console.error('❌ Erro ao remover item do carrinho - Status:', response.status);
                setListFavorites(originalCart);
                alert(`Erro ao remover item do carrinho (${response.status})`);
            } else {
                const updatedUser = await response.json();
                console.log('✅ Resposta do servidor:', updatedUser);
                setListFavorites(updatedUser.carrinho || []);

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
            console.error('❌ Erro ao remover item:', error);
            setListFavorites(originalCart);
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

                    <div className="paymentsMethods">
                        <h3>Forma de Pagamento:</h3>
                        <select value={selectedPayment} onChange={e => setSelectedPayment(e.target.value)}>
                            <option value="PIX">PIX</option>
                            <option value="CREDIT">Cartão de Crédito</option>
                            <option value="DEBIT">Cartão de Débito</option>
                        </select>
                    </div>

                    {(selectedPayment === "CREDIT" || selectedPayment === "DEBIT") && (
                        <div className="cardPaymentSection">
                            {userCards.length > 0 && (
                                <div className="existingCardsSection">
                                    <h3>Cartões Cadastrados:</h3>
                                    <select 
                                        value={selectedCard} 
                                        onChange={e => setSelectedCard(e.target.value)}
                                        className="cardSelectDropdown"
                                    >
                                        <option value="">Selecione um cartão</option>
                                        {userCards.map(card => (
                                            <option key={card.id} value={card.id}>
                                                {card.type} - **** **** **** {card.numberCard.slice(-4)}
                                            </option>
                                        ))}
                                    </select>
                                    <button 
                                        onClick={() => setShowNewCardForm(!showNewCardForm)}
                                        className="newCardToggleBtn"
                                    >
                                        {showNewCardForm ? 'Cancelar' : 'Cadastrar Novo Cartão'}
                                    </button>
                                </div>
                            )}

                            {(showNewCardForm || userCards.length === 0) && (
                                <div className="newCardFormContainer">
                                    <div className="cardFormHeader">
                                        <h1>Cadastre seu Novo Cartão</h1>
                                        <p>Preencha os dados para cadastrar um novo cartão</p>
                                    </div>
                                    
                                    <div className="cardFormFields">
                                        <div className="cardInputGroup">
                                            <label>Número do Cartão:</label>
                                            <input
                                                type="text"
                                                name="numberCard"
                                                value={cardData.numberCard}
                                                onChange={handleCardInputChange}
                                                placeholder="1234 5678 9012 3456"
                                                maxLength="19"
                                            />
                                        </div>

                                        <div className="cardInputRow">
                                            <div className="cardInputGroup">
                                                <label>Mês:</label>
                                                <input
                                                    type="text"
                                                    name="dueMonth"
                                                    value={cardData.dueMonth}
                                                    onChange={handleCardInputChange}
                                                    placeholder="MM"
                                                    maxLength="2"
                                                />
                                            </div>
                                            
                                            <div className="cardInputGroup">
                                                <label>Ano:</label>
                                                <input
                                                    type="text"
                                                    name="dueYear"
                                                    value={cardData.dueYear}
                                                    onChange={handleCardInputChange}
                                                    placeholder="AAAA"
                                                    maxLength="4"
                                                />
                                            </div>
                                            
                                            <div className="cardInputGroup">
                                                <label>CVV:</label>
                                                <input
                                                    type="text"
                                                    name="cvv"
                                                    value={cardData.cvv}
                                                    onChange={handleCardInputChange}
                                                    placeholder="123"
                                                    maxLength="4"
                                                />
                                            </div>
                                        </div>

                                        <button 
                                            onClick={saveCard} 
                                            disabled={isSubmittingCard}
                                            className="saveCardButton"
                                        >
                                            {isSubmittingCard ? 'Salvando...' : 'Salvar Cartão'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="informationsTotal">
                        <h1>Total do Carrinho: R$ {calculateTotal()}</h1>
                        <div className="checkoutButton">
                            <button onClick={addToPedidos} className="finalizarPedido">
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