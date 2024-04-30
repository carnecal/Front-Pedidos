import { Link } from "react-router-dom";

function NavBar() {
  return (
    <div className="bg-neutral-900 flex justify-between px-20 py-4">
      <Link className="text-white fonr-bold text-2xl">
      <h1> Carnecal Pedidos</h1>
      </Link>

      <ul className="flex gap-x-1">
        <li>
          <Link to="/" className="bg-amber-300  px-2 py-1">Home</Link>
        </li>
        <li>
          <Link to="/Pedidos" className="bg-amber-300 px-2 py-1">Nuevo Pedido</Link>
        </li>
        <li>
          <Link to="/PedidosCola" className="bg-amber-300 px-2 py-1">Pedido en Proceso</Link>
        </li>
      </ul>
    </div>
  );
}

export default NavBar;
