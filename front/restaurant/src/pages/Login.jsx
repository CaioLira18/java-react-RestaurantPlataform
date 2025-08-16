import React from 'react'

const Login = () => {
  return (
    <div>
      <div className="login">
        <div className="loginContainer">
          <div className="cabecalhoLogin">
            <div className="boxCabecalho">
              <h1>Bem Vindo !</h1>
              <p>Preencha as Informações para entrar</p>
            </div>
          </div>
          <div className="loginInput">
            <h1>Nome</h1>
            <div className="inputBox">
              <input type="text" />
            </div>
          </div>
          <div className="loginInput">
            <h1>Senha</h1>
            <div className="inputBox">
              <input type="text" />
            </div>
          </div>
          <div className="buttonLogin">
            <button>Entrar</button>
          </div>
          
        
        </div>
      </div>
    </div>
  )
}

export default Login
