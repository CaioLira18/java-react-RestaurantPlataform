import React, { useEffect, useState } from 'react'

const ItemComponent = ({ items, handleAddToList }) => {
  return (
    <div className="itemsGrid">
      {items.map((item) => (
        <div key={item.id} className="itemContainer">
          <div className="itemBox">
            <img src={item.image} alt={item.name} />
            <div className="itemInformations">
              <h1>{item.name}</h1>
              <h2>R$ {item.price}</h2>
              <p>{item.description}</p>
            </div>
            <div className="cartButton">
              <button onClick={() => handleAddToList(item)}>
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemComponent;
