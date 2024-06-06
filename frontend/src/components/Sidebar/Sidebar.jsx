import logo from "../../assets/logo.png";
import "./Sidebar.module.css";


const Sidebar = () => {
  return (
    <div id="sidebar">
      <div className="sidebar__title">
        <div className="sidebar__img">
          <img src={logo} alt="logo" />
          <h1>SaúdeON</h1>
        </div>
      </div>
      <div className="sidebar__menu">
        <div className="sidebar__link active_menu_link">
          <i className="fa-solid fa-house"></i>
          <a href="#">Home</a>
        </div>
        <h2>Menu</h2>
        <div className="sidebar__link">
          <i className="fa fa-user"></i>
          <a href="#">Perfil</a>
        </div>
        <div className="sidebar__link">
          <i className="fa-brands fa-rocketchat"></i>
          <a href="#">Entrar no Chat</a>
        </div>
        <div className="sidebar__link">
          <i className="fa fa-archive"></i>
          <a href="#">Politica de Privacidade</a>
        </div>
        <div className="sidebar__logout">
          <i className="fa fa-power-off"></i>
          <a href="#">Sair</a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
