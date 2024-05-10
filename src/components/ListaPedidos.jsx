import React, { useEffect, useState } from 'react'
import { usePedidos } from '../Context/PedidosProvider';
import * as XLSX from 'xlsx';


function ListaPedidos() {

    const { cargarTodosPedidos, pedidosTodos } = usePedidos();
    console.log(pedidosTodos)

    useEffect(() => {
        cargarTodosPedidos();
      }, [cargarTodosPedidos]);



  /** Metodo para generar Excel */
  const descargarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(pedidosTodos.flatMap((pedido) =>
      pedido.Items.map((item) => ({
        Cliente: pedido.Cliente.Nombre,
        Producto: item.Producto.Nombre,
        Cantidad: item.Cantidad,
        Peso: item.Peso,
        Observaciones: item.Observaciones,
        Recibio: pedido.Recibio.Nombre,
        Empaco: pedido.Empaco,
        'Hora Pedido': pedido.Hora_Pedido,
        Estado: pedido.Estado ? 'Entregado' : 'Pendiente',
        'Observaciones Generales': pedido.Observaciones_Generales,
        'Hora Despacho': pedido.Hora_Despacho,
      }))
    ));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedidos');
    XLSX.writeFile(workbook, 'pedidos.xlsx');
  };
  
  return (
    <div >
    <h1 className="text-2xl font-bold mb-4">Pedidos</h1>
    <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={descargarExcel}
      >
        Descargar Excel
      </button>
    <div >
      <table className="w-full table-auto mx-0 text-sm border-collapse border border-gray-200">
        <thead>
          <tr className="bg-slate-400 text-slate-800">
            <th className="border border-gray-700 px-3 py-2">Cliente</th>
            <th className="border border-gray-700 px-3 py-2">Producto</th>
            <th className="border border-gray-700 px-3 py-2">Cantidad</th>
            <th className="border border-gray-700 px-3 py-2">Peso</th>
            <th className="border border-gray-700 px-3 py-2">Observaciones</th>
            <th className="border border-gray-700 px-3 py-2">Recibio</th>
            <th className="border border-gray-700 px-3 py-2">Empaco</th>
            <th className="border border-gray-700 px-3 py-2">Hora Pedido</th>
            <th className="border border-gray-700 px-3 py-2">Estado</th>
            <th className="border border-gray-700 px-3 py-2">Observaciones Generales</th>
            <th className="border border-gray-700 px-3 py-2">Hora Despacho</th>
          </tr>
        </thead>
        <tbody tr className="bg-slate-300 text-xs">
          {pedidosTodos.map((pedido) => (
            <React.Fragment key={pedido._id}>
              {pedido.Items.map((item, index) => (
                <tr key={`${pedido._id}-${index}`}>
                  {index === 0 && (
                    <td className="border border-gray-700 px-3 py-2" rowSpan={pedido.Items.length}>
                      {pedido.Cliente.Nombre}
                    </td>
                  )}
                  <td className="border border-gray-700 px-3 py-2">{item.Producto.Nombre}</td>
                  <td className="border border-gray-700 px-3 py-2">{item.Cantidad}</td>
                  <td className="border border-gray-700 px-3 py-2">{item.Peso}</td>
                  <td className="border border-gray-700 px-3 py-2">{item.Observaciones}</td>
                  {index === 0 && (
                    <React.Fragment>
                      <td className="border border-gray-700 px-3 py-2" rowSpan={pedido.Items.length}>
                        {pedido.Recibio.Nombre}
                      </td>
                      <td className="border border-gray-700 px-3 py-2" rowSpan={pedido.Items.length}>
                        {pedido.Empaco}
                      </td>
                      <td className="border border-gray-700 px-3 py-2" rowSpan={pedido.Items.length}>
                        {pedido.Hora_Pedido}
                      </td>
                      <td className="border border-gray-700 px-3 py-2" rowSpan={pedido.Items.length}>
                        {pedido.Estado ? 'Entregado' : 'Pendiente'}
                      </td>
                      <td className="border border-gray-700 px-3 py-2" rowSpan={pedido.Items.length}>
                        {pedido.Observaciones_Generales}
                      </td>
                      <td className="border border-gray-700 px-3 py-2" rowSpan={pedido.Items.length}>
                        {pedido.Hora_Despacho}
                      </td>
                    </React.Fragment>
                  )}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
}

export default ListaPedidos