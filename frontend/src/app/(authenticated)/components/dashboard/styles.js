import styled from "styled-components"

export const Container = styled.div`
  background: #c4c9d3;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .dashboard__container {
    padding: 0px 10px 20px 320px;
    width: 100%;
    max-width: 1200px;
  }
  
  .dashboard__title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .dashboard__title > img {
    max-height: 100px;
    object-fit: contain;
    margin-right: 20px;
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
  
  .dashboard__cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
  }
  
  .card {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 150px;
    padding: 25px;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 5px 5px 13px #ededed, -5px -5px #fff;
  }
  
  .card_inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    text-align: center;
  }
  
  .card_inner > span {
    font-size: 25px;
  }
  
  .text-primary-p {
    margin: 0;
    font-size: 16px;
  }
  
  .fa-2x {
    margin-bottom: 15px;
  }
`