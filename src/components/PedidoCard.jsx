import { useCallback, useEffect, useState } from "react";
import loading from "../assets/load.gif";
import {
  ConsultarPedidoxIdRequest,
  EditarPedidoRequest,
} from "../api/Pedido.api";
import { usePedidos } from "../Context/PedidosProvider";
import Modal from "react-modal";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import QRious from "qrious";

function PedidoCard({ pedido }) {
 
  // GENERANDO EL PDF
  const generarPDF = (cliente, producto, cantidad, peso) => {
    const doc = new jsPDF();

    // Agrega contenido al PDF
    doc.setFontSize(14);
    doc.text(`Cliente: ${cliente}`, 20, 20);
    doc.text(`Producto: ${producto}`, 20, 30);
    doc.text(`Cantidad: ${cantidad} -  ${peso}`, 20, 40);

    // Obtener el PDF como datos binarios
    const pdfData = doc.output("datauristring");

    return pdfData;
  };

  // Función para generar el QR
  const generarQR = (pdfUrl) => {
    const qr = new QRious({
      value: pdfUrl,
      size: 500, // Tamaño del código QR
    });
    const url = qr.toDataURL();

    // Aquí puedes abrir una nueva ventana o pestaña con el QR generado
    const qrWindow = window.open("", "_blank");
    qrWindow.document.write(`<img src="${url}" alt="QR Code" />`);

    // Abrir la URL del PDF cuando se escanee el código QR
    qrWindow.onload = () => {
      window.open(pdfUrl);
    };
  };

  const mostrarPDF = (pdfData) => {
    const pdfWindow = window.open("", "_blank");
    pdfWindow.document.write(
      `<iframe src="${pdfData}" style="width:100%;height:100%;border:none;"></iframe>`
    );
  };

  const handleMostrarPDF = (cliente, producto,cantidad, peso) => {
    const pdfData = generarPDF(cliente, producto, cantidad,peso);
    mostrarPDF(pdfData);
  };
  // Llamar a la función generarQR cuando se haga clic en el botón "Generar QR"
  const handleGenerarQR = (cliente, producto, peso) => {
    const pdfData = generarPDF(cliente, producto, peso);
    const pdfUrl = `data:application/pdf;base64,${btoa(pdfData)}`;
    generarQR(pdfUrl);
  };

  const {
    cargarClientes,
    clientes,
    handleEmpacado,
    editarPedido,
    handleRefresh,
    productos,
    cargarProductos,
    cargarEmpleados,
    empleados,
  } = usePedidos();
  /** Logica para buscar el pedido con todas las caracteristicas */
  const [datosPedido, setDatosPedido] = useState({});
  const [mostrarModal, setMostrarModal] = useState(false);

  const cargarDatosPedido = useCallback(async () => {
    const response = await ConsultarPedidoxIdRequest(pedido._id);
    setDatosPedido(response.data);
    console.log(response.data);
  }, [pedido._id]);

  useEffect(() => {
    return () => {
      cargarDatosPedido();
    };
  }, [datosPedido]);

  /** Logica para los botones */
  const handleEditar = () => {
    setMostrarModal(true);
  };

  const handleCloseModal = () => {
    setMostrarModal(false);
  };

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(165, 90, 56, 0.5)",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      maxWidth: "400px",
      width: "100%",
      padding: "20px",
      backgroundColor: "#880b0b",
      border: "none",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(66, 8, 8, 0.1)",
      color: "#ebeff1", // Asegúrate de que el color del texto sea legible
    },
  };


  /** desglosando pedido */
  const [idCliente, setIdCliente] = useState("");
  const [idProducto, setIdProducto] = useState("");
  const [items, setItems] = useState([]);
  const [clienteEncontrado, setClienteEncontrado] = useState({});
  const [productoEncontrado, setProductoEncontrado] = useState({});

  useEffect(() => {
    setIdCliente(pedido.Cliente);
    setItems(pedido.Items ? pedido.Items : []); // Verifica si pedido.Items no es undefined
    pedido.Items && pedido.Items.map((item) => {
      setIdProducto(item.Producto);
    });
  }, [pedido]);

  /** Estado carga CLIENTES */

  useEffect(() => {
    cargarClientes();
  }, [cargarClientes]);

  useEffect(() => {
    if (clientes.length > 0) {
      const clienteEncontrado = clientes.find(
        (cliente) =>
          cliente._id && cliente._id.toString() === idCliente
      );
      setClienteEncontrado(clienteEncontrado);
    }
  }, [clientes, idCliente]);

  /**EFECTO CARGAR PRODUCTO */
  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  useEffect(() => {
    function nombreProducto(idProducto) {
      const productoEncontrado = productos.find(
        (producto) =>
          producto._id && producto._id.toString() === idProducto.toLowerCase()
      );
      return productoEncontrado ? productoEncontrado.Nombre : "";
    }
  
    if (productos.length > 0) {
      setItems((prevItems) => {
        // Verifica si prevItems no es undefined y tiene elementos
        if (prevItems && prevItems.length > 0) {
          // Mapea los items y actualiza el nombre del producto
          return prevItems.map((item) => ({
            ...item,
            NombreProducto: nombreProducto(item.Producto),
          }));
        } else {
          // Si prevItems es undefined o está vacío, retorna un arreglo vacío
          return [];
        }
      });
    }
  }, [productos, setItems]);

  /** PROCESOS PARA EL BOTON TOMADO */

  const [pedidoTomado, setPedidoTomado] = useState(false);
  const [showTomadoModal, setShowTomadoModal] = useState(false);
  const [nombreEmpleado, setNombreEmpleado] = useState("");
  const handleTomadoClick = () => {
    setPedidoTomado(true);
    setShowTomadoModal(true);
  };

  const handleCloseModalTomado = () => {
    setShowTomadoModal(false);
  };

  useEffect(() => {
    cargarEmpleados();
  }, [cargarEmpleados]);

  /** Actualizar Empleado que despacha */
  const handleActualizarPedido = async (name) => {
    try {
      editarPedido(pedido._id, { Empaco: name });
      console.log("Pedido actualizado");
    } catch (error) {
      console.error("Error al actualizar el pedido:", error);
    }
  };

  /** PROCESOS PARA EL BOTON EMPACADO */

  const [codigoEmpleadoTomado, setCodigoEmpleadoTomado] = useState(null);
  const [showEmpacadoModal, setShowEmpacadoModal] = useState(false);

  const handleEmpacadoClick = () => {
    const empleadoEncontrado = empleados.find(
      (empleado) =>
        empleado.Nombre.toLowerCase() === pedido.Empaco.toLowerCase()
    );
    if (empleadoEncontrado) {
      setCodigoEmpleadoTomado(empleadoEncontrado.Cedula);
    } else {
      // Mostrar un mensaje de error si el empleado no se encuentra
      alert("El empleado no fue encontrado");
    }

    setShowEmpacadoModal(true);
  };
  

  const handleCloseModalEmpacado = () => {
    setShowEmpacadoModal(false);
  };

  const [nombresProductos, setNombresProductos] = useState({});

  useEffect(() => {
    const nombres = {};
    productos.forEach(producto => {
      nombres[producto._id] = producto.Nombre;
    });
    setNombresProductos(nombres);
  }, [productos]);
  
  const nombreProducto = (idProducto) => {
    return nombresProductos[idProducto] || '';
  };

/** ESTADOS PARA EDITAR */
const [itemToEdit, setItemToEdit] = useState(null);
const[showEditModal, setShowEditModal]=useState(false)
  return (
    <>
      {!pedido.Estado && (
        <div className="bg-slate-300 rounded-md p-1 relative">
          {pedido.Empaco && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <img src={loading} alt="Procesando" className="w-24 h-24" />
            </div>
          )}

          <div key={pedido._id}>
            <header className="flex justify-between ">
              <h2 className="text-sm font-bold">Pedido #</h2>
              <span>{pedido.Estado ? "✅" : "🥩"}</span>
            </header>
            <br />

            <h2 className="mx-4 text-sm font-bold">
              {clienteEncontrado?.Nombre || ""}
            </h2>
            <br />
            <div className="overflow-auto max-h-72 mr-1">
              <table className="  w-full table-auto mx-0 text-sm text-left rtl:text-right bg-slate-300 text-gray-500 dark:text-gray-400 ">
                <thead class=" text-center text-xs text-black uppercase  bg-slate-200 dark:text-gray-800">
                  <tr></tr>
                  <tr>
                    <th scope="col" className="px-2 py-1">
                      Cant
                    </th>
                    <th scope="col" className="px-2 py-1">
                      Peso
                    </th>
                    <th scope="col" className="px-3 py-2">
                      Corte
                    </th>
                    <th scope="col" className="py-1">
                      Obs
                    </th>
                    <th scope="col" className="py-1 "></th>
                    <th scope="col" className="py-1 "></th>
                  </tr>
                </thead>
                <tbody>
                {(items && items.length > 0) ? (
  items.map((item, index) => (
                    <tr
                      key={`${item.Producto}-${index}`}
                      className="text-center text-black odd:bg-white odd:dark:bg-gray-300 even:bg-gray-50 even:dark:bg-gray-400 border-b dark:border-gray-500"
                    >
                      <td>
                        <h6>{item.Cantidad}</h6>
                      </td>
                      <td>
                        <span>{item.Peso}</span>
                      </td>
                      <td>
                        <span>{nombreProducto(item.Producto)}</span>
                      </td>
                      <td>
                        <span>{item.Observaciones}</span>
                      </td>
                      <td>
                        {/* Botón para editar el item */}
                        <button 
                         onClick={() => {
                          setItemToEdit(item);
                          setShowEditModal(true);
                        }}
                        className="bg-red-600 px-2 py-1 text-white">
                          Editar
                        </button>
                      </td>
                      <td>
                        {/* Botón para generar QR */}
                        <button
                          className="bg-amber-600 px-2 py-1 text-white"
                          onClick={() =>
                            handleMostrarPDF(
                              clienteEncontrado.Nombre,
                              nombreProducto(item.Producto),
                              item.Cantidad,
                              item.Peso
                            )
                          }
                        >
                          Generar QR
                        </button>
                      </td>
                    </tr>
                  ))): (<p></p>)}
                </tbody>
              </table>
            </div>
            <br />
            <h2 className="px-4 text-sm font-semibold">
              Hora Pedido: {pedido.Hora_Pedido}
            </h2>
            <br />
            {pedido.Empaco && (
              <h2 className="px-4 text-sm font-semibold">
                Preparado por: {pedido.Empaco}
              </h2>
            )}
            <div className="px-4 flex gap-x-1 py-4 justify-center">
              <button
                className="bg-red-600 px-2 py-1 text-white"
                onClick={() => {
                  console.log(pedido._id);
                  handleEmpacadoClick();
                }}
              >
                Empacado
              </button>
              {/**Modal Empacado */}
              <div>
                {showEmpacadoModal && (
                  <div>
                    <Modal
                      style={customStyles}
                      isOpen={showEmpacadoModal}
                      onClose={handleCloseModalEmpacado}
                    >
                      <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                          Ingrese su Código
                        </h3>
                        <button
                          type="button"
                          onClick={handleCloseModalEmpacado}
                          class="text-orange-200 bg-transparent hover:bg-orange-400 hover:text-orange-400 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-orange-400 dark:hover:text-white"
                          data-modal-toggle="crud-modal"
                        >
                          <svg
                            class="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                          >
                            <path
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                          </svg>
                          <span class="sr-only">Close modal</span>
                        </button>
                      </div>
                      <Formik
                        initialValues={{ codigo: "" }}
                        onSubmit={(values) => {
                          const codigoIngresado = values.codigo.toLowerCase();
                          if (
                            codigoEmpleadoTomado &&
                            codigoEmpleadoTomado.toLowerCase() ===
                              codigoIngresado
                          ) {
                            handleEmpacado(pedido._id, { Estado: true });
                            setShowEmpacadoModal(false);
                          } else {
                            // Mostrar un mensaje de error si el código no coincide
                            alert(
                              "El código ingresado no coincide con el empleado que tomó el pedido"
                            );
                          }
                        }}
                      >
                        {(formik) => (
                          <Form className="p-4 md:p-5">
                            <Field
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-red-200 dark:border-gray-500 dark:placeholder-gray-800 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              type="text"
                              id="codigo"
                              name="codigo"
                              placeholder="Código del empleado"
                            ></Field>
                            <button
                              class="text-white  my-4 mx-28 inline-flex items-center bg-orange-400 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-400 dark:hover:bg-amber-600 dark:focus:ring-orange-500"
                              type="submit"
                            >
                              Aceptar
                            </button>
                          </Form>
                        )}
                      </Formik>
                    </Modal>
                  </div>
                )}
              </div>

              <button
                className="bg-lime-900  px-2 py-1 text-white"
                onClick={() => {
                  handleTomadoClick();
                }}
              >
                Tomado
              </button>
            </div>
            {/**Modal Tomado */}
            <div>
              {showTomadoModal && (
                <div>
                  <Modal
                    style={customStyles}
                    isOpen={showTomadoModal}
                    onClose={handleCloseModalTomado}
                  >
                    <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        Ingrese su Código
                      </h3>
                      <button
                        type="button"
                        onClick={handleCloseModalTomado}
                        class="text-orange-200 bg-transparent hover:bg-orange-400 hover:text-orange-400 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-orange-400 dark:hover:text-white"
                        data-modal-toggle="crud-modal"
                      >
                        <svg
                          class="w-3 h-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 14"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                          />
                        </svg>
                        <span class="sr-only">Close modal</span>
                      </button>
                    </div>
                    <Formik
                      initialValues={{ nombre: "" }}
                      onSubmit={(values) => {
                        const empleadoEncontrado = empleados.find(
                          (empleado) =>
                            empleado.Cedula.toLowerCase() ===
                            values.nombre.toLowerCase()
                        );
                        if (empleadoEncontrado) {
                          setNombreEmpleado(empleadoEncontrado.Nombre);
                          handleActualizarPedido(empleadoEncontrado.Nombre);
                        } else {
                          // Mostrar un mensaje de error si el empleado no se encuentra
                          alert("El empleado no fue encontrado");
                        }
                        setShowTomadoModal(false);
                      }}
                    >
                      {(formik) => (
                        <Form className="p-4 md:p-5">
                          <Field
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-red-200 dark:border-gray-500 dark:placeholder-gray-800 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            type="text"
                            id="nombre"
                            name="nombre"
                            placeholder="Código del empleado"
                          ></Field>
                          <button
                            class="text-white  my-4 mx-28 inline-flex items-center bg-orange-400 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-400 dark:hover:bg-amber-600 dark:focus:ring-orange-500"
                            type="submit"
                          >
                            Aceptar
                          </button>
                        </Form>
                      )}
                    </Formik>
                  </Modal>
                </div>
              )}
            </div>
            {/**Modal Editar */}
            <Modal
  isOpen={showEditModal}
  onRequestClose={() => setShowEditModal(false)}
  style={customStyles}
>
  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      Editar Item
    </h3>
    <button
      type="button"
      onClick={() => setShowEditModal(false)}
      className="text-orange-200 bg-transparent hover:bg-orange-400 hover:text-orange-400 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-orange-400 dark:hover:text-white"
    >
      {/* ... */}
    </button>
  </div>
  <Formik
    initialValues={{
      producto: nombreProducto(itemToEdit?.Producto) || '',
      cantidad: itemToEdit?.Cantidad || '',
      peso: itemToEdit?.Peso || '',
      observaciones: itemToEdit?.Observaciones || '',
    }}
    onSubmit={(values) => {
      // Crear una nueva versión del item con los valores actualizados
      const updatedItem = {
        ...itemToEdit,
        Cantidad: values.cantidad,
        Observaciones: values.observaciones,
      };
      console.log(updatedItem)
      // Actualizar solo el item seleccionado en el array Items del pedido
      const updatedItems = pedido.Items.map((item) =>
        item._id=== itemToEdit._id ? updatedItem : item
      );

      // Llamar a editarPedido con los nuevos Items
      editarPedido(pedido._id, { Items: updatedItems });
      console.log(updatedItems)
      setShowEditModal(false);
    }}
  >
    {(formik) => (
      <Form className="p-4 md:p-5">
         <div>
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="cantidad"
          >
            Cantidad
          </label>
          <Field
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-red-200 dark:border-gray-500 dark:placeholder-gray-800 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
            type="text"
            id="cantidad"
            name="cantidad"
          />
        </div>
        <div></div>
        <div>
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="peso"
          >
            Peso
          </label>
          <Field
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-red-200 dark:border-gray-500 dark:placeholder-gray-800 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
            type="text"
            id="peso"
            name="peso"
            readOnly
          />
        </div>
        <div>
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="producto"
          >
            Producto
          </label>
          <Field
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-red-200 dark:border-gray-500 dark:placeholder-gray-800 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
            type="text"
            id="producto"
            name="producto"
            readOnly
          />
        </div>
        <div>
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="observaciones"
          >
            Observaciones
          </label>
          <Field
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-red-200 dark:border-gray-500 dark:placeholder-gray-800 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
            type="text"
            id="observaciones"
            name="observaciones"
          />
        </div>
        {/* Campos para peso y observaciones */}
        <button
          className="text-white my-4 mx-28 inline-flex items-center bg-orange-400 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-400 dark:hover:bg-amber-600 dark:focus:ring-orange-500"
          type="submit"
        >
          Guardar
        </button>
      </Form>
    )}
  </Formik>
</Modal>
          </div>
        </div>
      )}
    </>
  );
}

export default PedidoCard;
