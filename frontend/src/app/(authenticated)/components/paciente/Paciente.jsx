import healthcare from '../../../assets/healthcare.png'
import Sidebar from '../sidebar/Sidebar'
import { Container } from './styles'

const Dashboard = () => {
  const chatsToAttend = [
    { id: 1, name: "Chat 1", date: "01/06/2024" },
    { id: 2, name: "Chat 2", date: "01/06/2024"  },
    { id: 3, name: "Chat 3", date: "01/06/2024"  },
  ];

  return (
    <main className="dashboard">
      <div className="dashboard__wrapper">
        <Sidebar /> {/* Renderizando a Sidebar aqui */}
        <div className="dashboard__container">
          <div className="dashboard__title">
            <img src={healthcare} alt="Hello" />
            <div className="dashboard__greeting">
              <h1>Olá, paciente</h1>
              <p>Bem vindo ao SaudeON</p>
            </div>
          </div>
          <div className="dashboard__card">
            <div className="card">
              <i className="fa fa-history fa-2x text-lightblue"></i>
              <div className="card_inner">
                <p className="text-primary-p">Atendimentos anteriores</p>
                <span className="font-bold text-title"> 558 atendimentos</span>
              </div>
            </div>
          </div>
          <div className="chat-card">
            <i className="fa fa-comments fa-2x text-purple"></i>
            <div className="chat-card_inner">
              <p className="text-primary-p">Chats anteriores</p>
              <ul className="chat-list">
                {chatsToAttend.map((chat) => (
                  <li key={chat.id} className="chat-item">
                    <span className="chat-name">{chat.name}</span>
                    <span className="chat-date">{chat.date}</span>
                    <button className="view-button">Visualizar</button>
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
