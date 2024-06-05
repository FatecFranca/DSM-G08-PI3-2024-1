import styled from "styled-components"

export const Container = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 90vh;
  padding: 16px;
  margin: 20px 42px 20px 42px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  background-color: #62849b;
  `

export const ChatContainer = styled.ul`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
`

export const MessageItem = styled.li`
  display: flex;
  justify-content: flex-end;
  list-style: none;
  
  span {
    border: 1px solid #c3e88d;
    background-color: #82be27;
    border-radius: 6px;
    display: inline-block;
    margin-bottom: 1rem;
    padding: 0.5rem 1rem;
    text-align: right;
  }
`

export const ReceivedMessageItem = styled(MessageItem)`
  display: flex;
  justify-content: flex-start;

  span {
    background: #89ddff;
    border-color: #1abeff;
    text-align: left;
  }
`

export const MessageInputForm = styled.form`
  background: #434758;
  padding: 1rem;
`

export const FormField = styled.input`
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  color: #333;
  font-size: 1.2rem;
  padding: 0.4rem 1rem;
  width: 100%;

  &:focus {
    border-color: #a3f7ff;
    box-shadow: 0 0 7px #a3f7ff;
    outline: none;
  }
`