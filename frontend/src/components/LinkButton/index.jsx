import { Container } from "./styles"

export const LinkButton = ({ href, children, ...props }) => {
  return (
    <Container href={href} {...props}>
      {children}
    </Container>
  )
}