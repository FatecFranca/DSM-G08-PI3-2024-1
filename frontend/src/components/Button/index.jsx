import { Container } from "./styles"

export const Button = ({ onClick, children, ...props }) => {
  return (
    <Container onClick={onClick} {...props}>
      {children}
    </Container>
  )
}