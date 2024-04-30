import { Routes, Route } from "react-router-dom"
import Home from "../Pages/Home"
import Pedidos from "../Pages/Pedidos"
import Clientes from "../Pages/Clientes"
import PedidosR from "../Pages/PedidosR"
import NotFound from "../Pages/NotFound"


function MyRoutes() {
  return (
    
    <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/Pedidos" element={<Pedidos/>} />
        <Route path="/Clientes" element={<Clientes/>} />
        <Route path="/PedidosCola" element={<PedidosR/>}/>
        <Route path="*" element={<NotFound/>}/>
    </Routes>
  )
}

export default MyRoutes