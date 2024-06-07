import styled from "styled-components"

export const Container = styled.main`
  display: grid;
  height: 100vh;
  grid-template-columns: 0.9fr repeat(3,1fr);
  grid-template-rows: 0.2fr 3fr;
  grid-template-areas: 
  'sidebar nav nav nav'
  'sidebar main main main';

  ::-webkit-scrollbar{
  width: 5px;
  height: 6px;
  }
  ::-webkit-scrollbar-track{
    box-shadow: inset 0 0 5px #a5aaad;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover{
    background: #a5aaad;
  }

  .text-primary-p{
    color: #a5aaad;
    font-size: 14px;
    font-weight: 700;
  }

  .text-title{
    color: #2e4a66;
  }

  .text-lightblue{
    color: #469cac;
  }

  .text-red{
    color: #cc3d38;
  }

  .text-yellow{
    color: #a98921;
  }

  .text-green{
    color: #3b9668;
  }
`


/* @media only screen and (max-width: 978px){
  .conteiner{
  .grid-template-columns: 1fr;
  grid-template-rows: 0.2fr 3fr;
  grid-template-areas: "nav" "main" ;
  } */