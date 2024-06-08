import styled from "styled-components"

export const Container = styled.aside`
  background: #020509;
  grid-area: sidebar;
  overflow-y: auto;
  padding: 20px;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
  height: 100vh;
  position: fixed;
  width: 250px;
  .sidebar__button {
    color: inherit;
    background-color: inherit;
    text-decoration: none;
    color: #a5aaad;
    font-weight: 900;
    outline: none;
    border: none;
    cursor: pointer;
  }

  .logout__button {
    background: transparent;
    color: #e65061;
    font-weight: 700;
    cursor: pointer;
    text-transform: uppercase;
    outline: none;
    border: none;
  }

  .sidebar__img {
    display: flex;
    width: 100%;
    align-items: center;
    padding-bottom: 30px;
  }

  .sidebar__title > div > img {
      width: 100px;
      object-fit: contain;
      border-radius: 30%;
  }

  .sidebar__title > div > h1 {
      font-size: 29px;
      display: inline;
      margin-left: 15px;
      display: flex;
      align-items: center;
      color: #f3f4f6;
      margin-bottom: 30px;
      margin-top: 30px;
      margin-right: 15px;
  }

  .sidebar__title > i {
      font-size: 18px;
      display: none;
  }

  .sidebar__menu > h2 {
      color: #3f97cd;
      font-size: 20px;
      margin-top: 15px;
      margin-bottom: 30px; 
      padding: 0 10px;
      padding-top: 30px;
      font-weight: 700;
  }

  .sidebar__link {
      color: #f3f4f6;
      padding: 10px;
      border-radius: 3px;
      margin-bottom: 25px; 
      transition: background 0.3s;
  }

  .sidebar__link:hover {
      background: #1a1f25; 
  }

  .active_menu_link {
      background: rgba(86, 126, 196, 0.437);
      color: #3f97cd;
  }

  .active_menu_link a {
      color: #3f97cd;
  }

  .sidebar__link > a {
      text-decoration: none;
      color: #a5aaad;
      font-weight: 700;
  }

  .sidebar__link > i {
      margin-right: 10px;
      font-size: 18px;
  }

  .sidebar__logout {
      position: absolute; 
      bottom: 20px;
      left: 20px;
      width: calc(100% - 40px); 
  }

  .sidebar__logout > a {
      text-decoration: none;
      color: #e65061;
      font-weight: 700;
      text-transform: uppercase;
  }

  .sidebar__logout > i {
      margin-right: 10px;
      font-size: 18px;
      color: #e65061;
      margin-bottom: 20px;
  }

  .sidebar-responsive {
      display: inline !important;
      z-index: 9999 !important;
      left: 0 !important;
      position: absolute;
  }
`