import styled from "styled-components"


function SideBar({}) {
  return (
    <Container>
      <div className="Logocontent">

      </div>
    </Container>
  )
}

const Container=styled.div`
  background: ${(props)=>props.theme.bg};
`

export default SideBar