import React, { useEffect, useState } from 'react'

const Hamburgers = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [items, setItems] = useState([]);

    const API_URL = "http://localhost:8080/api";

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


    useEffect(() => {
        fetch(`${API_URL}/items`)
            .then((res) => res.json())
            .then((data) => Array.isArray(data) && setItems(data))
            .catch((err) => console.error("Erro ao buscar Items", err));
    }, []);

    return (
        <div>
            <div className="itemPageContainer">
                <img src="https://res.cloudinary.com/dmf7ocduw/image/upload/v1755474447/1_e1km4n.png" alt="" />
                <h1>Hamburguers</h1>
            </div>
            <div className="itemPageIndividual">
                {items
                    .filter(item => item.type === "HAMBURGUER")
                    .map((item) => (
                        <div key={item.id} className="itemContainer">
                            <div className="itemBox">
                                <img src={item.image} alt={item.name} />
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
        </div>
    )
}

export default Hamburgers
