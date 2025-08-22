import React, { useState } from 'react';

const AddProduct = () => {
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");

    const API_URL = "http://localhost:8080/api";

    function addItem() {
        if (!name.trim() || !description.trim() || !image.trim() || !price.trim() || !type.trim()) {
            alert("Preencha os campos obrigatórios.");
            return;
        }

        const payload = {
            name,
            description,
            image,
            price,   // agora está incluído
            type,
        };

        fetch(`${API_URL}/items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao adicionar.");
                }
                return response.json();
            })
            .then(() => {
                alert("Adicionado com sucesso!");
                setName("");
                setDescription("");
                setImage("");
                setPrice("");
                setType("");
            })
            .catch(error => {
                console.error(error);
                alert("Erro ao adicionar.");
            });
    }

    return (
        <div>
            <div className="containerItem">
                <div className="boxItem">
                    <h1>Adicionar Item</h1>

                    {/* Nome */}
                    <div className="inputBox">
                        <div className="textLogo">
                            <i className="fa-solid fa-pencil"></i>
                            <h2>Name</h2>
                        </div>
                        <div className="inputArea">
                            <input value={name} onChange={(e) => setName(e.target.value)} type="text" />
                        </div>
                    </div>

                    {/* Preço */}
                    <div className="inputBox">
                        <div className="textLogo">
                            <i className="fa-solid fa-coins"></i>
                            <h2>Price</h2>
                        </div>
                        <div className="inputArea">
                            <input value={price} onChange={(e) => setPrice(e.target.value)} type="text" />
                        </div>
                    </div>

                    {/* Descrição */}
                    <div className="inputBox">
                        <div className="textLogo">
                            <i className="fa-solid fa-comment"></i>
                            <h2>Description</h2>
                        </div>
                        <div className="inputArea">
                            <input value={description} onChange={(e) => setDescription(e.target.value)} type="text" />
                        </div>
                    </div>

                    {/* Imagem */}
                    <div className="inputBox">
                        <div className="textLogo">
                            <i className="fa-solid fa-image"></i>
                            <h2>Image</h2>
                        </div>
                        <div className="inputArea">
                            <input value={image} onChange={(e) => setImage(e.target.value)} type="text" />
                        </div>
                    </div>

                    {/* Tipo */}
                    <div className="inputBox">
                        <div className="textLogo">
                            <i className="fa-solid fa-list"></i>
                            <h2>Tipo</h2>
                        </div>
                        <div className="inputArea">
                            <select
                                name="type"
                                id="type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="">Selecione...</option>
                                <option value="HAMBURGUER">HAMBURGUER</option>
                                <option value="DRINK">DRINK</option>
                                <option value="PIZZA">PIZZA</option>
                                <option value="SIDEDISH">SIDEDISH</option>
                            </select>
                        </div>
                    </div>

                    <div className="addItemButton">
                        <button onClick={addItem}>Adicionar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
