import React from 'react'

const Header = () => {
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
                    <i class="fa-solid fa-house"></i>
                    <li><a href="">Home</a></li>
                </div>
                <div className="optionIndividual">
                    <i class="fa-solid fa-basket-shopping"></i>
                    <li><a href="">Produtos</a></li>
                </div>
                <div className="optionIndividual">
                    <i class="fa-solid fa-clipboard-list"></i>
                    <li><a href="">Pedidos</a></li>
                </div>
                <div className="optionIndividual">
                    <i class="fa-solid fa-user"></i>
                    <li><a href="">Login</a></li>
                </div>
                </ul>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Header
