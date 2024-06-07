import Image from 'next/image'
import healthcare from '../../../assets/healthcare.png'
import { Container } from './styles'

const Dashboard = () => {
  const chatsToAttend = [
    { id: 1, name: "Paciente 1" },
    { id: 2, name: "Paciente 2" },
    { id: 3, name: "Paciente 3" },
  ];

  return (
    <main className="dashboard">
      <div className="dashboard__wrapper">
        <Sidebar /> {/* Renderizando a Sidebar aqui */}
        <div className="dashboard__container">
          <div className="dashboard__title">
            <img src={healthcare} alt="Hello" />
            <div className="dashboard__greeting">
              <h1>Olá, atendente</h1>
              <p>Bem vindo ao seu Painel</p>
            </div>
          </div>
          <div className="dashboard__cards">
            <div className="card">
              <i className="fa fa-history fa-2x text-lightblue"></i>
              <div className="card_inner">
                <p className="text-primary-p">Total de atendimentos</p>
                <span className="font-bold text-title"> 558 atendimentos</span>
              </div>
            </div>
            <div className="card">
              <i className="fa fa-users fa-2x text-green"></i>
              <div className="card_inner">
                <p className="text-primary-p">Atendimentos em aberto</p>
                <span className="font-bold text-title"> 10 pessoas na fila </span>
              </div>
            </div>
            <div className="card">
              <i className="fa fa-star fa-2x text-yellow"></i>
              <div className="card_inner">
                <p className="text-primary-p">Avaliações</p>
                <span className="font-bold text-title"> 4/5</span>
              </div>
            </div>
          </div>
          <div className="chat-card">
            <i className="fa fa-comments fa-2x text-purple"></i>
            <div className="chat-card_inner">
              <p className="text-primary-p">Chats para atender</p>
              <ul className="chat-list">
                {chatsToAttend.map((chat) => (
                  <li key={chat.id} className="chat-item">
                    <span className="chat-name">{chat.name}</span>
                    <button className="accept-button">Aceitar</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
