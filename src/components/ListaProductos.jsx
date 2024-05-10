import React, { useEffect } from 'react'
import { usePedidos } from '../Context/PedidosProvider';



function ListaProductos() {


    const { cargarProductos, productos } = usePedidos();
    console.log(productos)
    
    useEffect(() => {
        cargarProductos();
      }, [cargarProductos]);
          
  return (
    <div>
<h1 className="text-2xl font-bold mb-4">Productos</h1>

<div >
      <table className="w-full table-auto mx-0 text-sm border-collapse border border-gray-200">
        <thead>
          <tr className="bg-slate-400 text-slate-800">
            <th className="border border-gray-700 px-3 py-2">Nombre</th>
            <th className="border border-gray-700 px-3 py-2">Codigo</th>
           
          </tr>
        </thead>
        <tbody tr className="bg-slate-300 text-xs">
          {productos.map((product) => (
            <tr>
            <React.Fragment key={product._id}>
             
                  <td className="border border-gray-700 px-3 py-2">{product.Nombre}</td>
                  <td className="border border-gray-700 px-3 py-2">{product.Codigo}</td>
                  
                    </React.Fragment>
                    </tr>
                  ))}
                
            
            
        </tbody>
      </table>
    </div>
    </div>
    
  )
}

export default ListaProductos