import CardGeneral from "../components/CardGeneral"
import clientes from "../assets/clientes.jpg";
import pedidos from "../assets/pedidos.jpg";
import productos from "../assets/productos.jpg";
import ppal from "../assets/ppal.png";


function Home() {
  return (
    <>
    
    <div className="grid grid-cols-3 gap-2">      
      <CardGeneral img={pedidos} data={"Pedidos"} page={"PedidosHome"}/>
      <CardGeneral img={productos} data={"Productos"} page={"Productos"}/>      
      <CardGeneral img={clientes} data={"Clientes"} page={"Clientes"}/>
  </div>
    </>
    
    
  )
}

export default Home