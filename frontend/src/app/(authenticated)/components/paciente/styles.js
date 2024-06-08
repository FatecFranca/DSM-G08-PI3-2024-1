import styled from "styled-components"

export const Container = styled.div`
  background: #c4c9d3;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;


  .dashboard__wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  }

  .dashboard__container {
    padding: 20px 15px 40px 390px;
    width: 100%;
    max-width: 1200px;
    display: flex;
    flex-direction: column; 
    gap: 20px;
    margin: auto;
  }

  .dashboard__title {
    display: flex;
    align-items: center;
    width: 100%; /* Ocupa toda a largura disponível */
    justify-content: flex-start; /* Alinha o conteúdo à esquerda */
    margin-bottom: 20px;
  }

  .dashboard__title > img {
    max-height: 50px;
    padding-right: 20px;
    width: fit-content;
    object-fit: contain;
  }

  .dashboard__greeting > h1 {
    font-size: 24px;
    color: #2e4a66;
    margin-bottom: 5px;
  }

  .dashboard__greeting > p {
    font-size: 14px;
    font-weight: 700;
    color: #2e99db;
  }

  .dashboard__card {
    display: flex;
    justify-content: flex-start;
    width: 100%;
  }

  .card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 180px; 
    width: 100%; 
    padding: 25px;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 5px 5px 13px #ededed, -5px -5px #fff;
    text-align: center;
  }

  .card_inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .card_inner > p {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
  }

  .card_inner > span {
    font-size: 25px;
  }

  .fa-2x {
    margin-bottom: 15px;
  }

  .chat-card {
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 5px 5px 13px #ededed, -5px -5px #fff;
    padding: 25px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    max-width: 1200px;
  

  }


  .chat-card__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    text-align: center;
  }

  .chat-list {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }

  .chat-item {
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
  }

  .chat-name, .chat-date {
    font-size: 1rem;
  }

  .view-button {
    background-color: #4CAF50;
    text-decoration: none;
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .view-button:hover {
    background-color: #45a049;
  }

  ::-webkit-scrollbar {
    width: 5px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px #a5aaad;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #3ea175;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #a5aaad;
  }

  * {
    margin: 0;
    padding: 0;
  }

  body {
    box-sizing: border-box;
    font-family: 'Lato', sans-serif;
  }

  .text-primary-p {
    color: #a5aaad;
    font-size: 14px;
    font-weight: 700;
  }

  .text-title {
    color: #2e4a66;
  }

  .text-lightblue {
    color: #469cac;
  }

  .text-red {
    color: #cc3d38;
  }

  .text-yellow {
    color: #a98921;
  }

  .text-green {
    color: #3b9668;
  }

  .conteiner {
    display: grid;
    height: 100vh;
    grid-template-columns: 0.8fr repeat(3, 1fr);
    grid-template-rows: 0.2fr 3fr;
  }
`


