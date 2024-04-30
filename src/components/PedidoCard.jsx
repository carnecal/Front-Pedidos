import { useEffect, useState } from "react";
import loading from "../assets/load.gif";
import {
  ConsultarPedidoxIdRequest,
  EditarPedidoRequest,
} from "../api/Pedido.api";
import { usePedidos } from "../Context/PedidosProvider";
import Modal from "react-modal";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { ConsultarClientes, ConsultarClientexId } from "../api/Cliente.api";
import { ConsultarProductosRequest } from "../api/Productos.api";
import { useNavigate } from 'react-router-dom';

function PedidoCard({ pedido }) {
  const { handleEmpacado, editarPedido, handleRefresh } = usePedidos();
  /** Logica para buscar el pedido con todas las caracteristicas */
  const [datosPedido, setDatosPedido] = useState({});
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    return () => {
      handleRefresh();
    };
  }, []);
  const navigate = useNavigate();
  const handleRefrescar = () => {
    // Recargar la página
    navigate('/PedidosCola');
  };

  useEffect(() => {
    async function cargarDatosPedido() {
      const response = await ConsultarPedidoxIdRequest(pedido._id);
      setDatosPedido(response.data);
    }

    cargarDatosPedido();
  }, [pedido._id]);

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

  /**recarga page  */

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Redireccionar a la ruta '/PedidosCola'
      navigate('/PedidosCola');
    }, 20000); // Intervalo de 20000 milisegundos = 20 segundos

    return () => {
      // Limpiar el temporizador cuando el componente se desmonte o actualice
      clearInterval(intervalId);
    };
  }, [navigate]);

  /** desglosando pedido */
  const [idCliente, setIdCliente] = useState("");
  const [idProducto, setIdProducto] = useState("");
  const [items, setItems] = useState([]);
  const [cliente, setCliente] = useState([]);
  const [clienteEncontrado, setClienteEncontrado] = useState({});
  const [producto, setProducto] = useState([]);
  const [productoEncontrado, setProductoEncontrado] = useState({});

  useEffect(() => {
    setIdCliente(pedido.Cliente);
    setItems(pedido.Items);
    pedido.Items.map((item) => {
      setIdProducto(item.Producto);
    });
  }, [pedido]);

  useEffect(() => {
    async function cargarDatosCliente() {
      try {
        const response = await ConsultarClientes();
        setCliente(response.data);
      } catch (error) {
        console.error("Error al cargar datos del cliente:", error);
      }
    }

    cargarDatosCliente();
  }, []);

  useEffect(() => {
    if (cliente.length > 0) {
      const clienteEncontrado = cliente.find(
        (cliente) =>
          cliente._id && cliente._id.toString() === idCliente.toLowerCase()
      );
      setClienteEncontrado(clienteEncontrado);
    }
  }, [cliente, idCliente]);

  useEffect(() => {
    async function cargarDatosProducto() {
      try {
        const response = await ConsultarProductosRequest();
        setProducto(response.data);
      } catch (error) {
        console.error("Error al cargar datos del producto:", error);
      }
    }

    cargarDatosProducto();
  }, []);

  useEffect(() => {
    function nombreProducto(idProducto) {
      const productoEncontrado = producto.find(
        (producto) =>
          producto._id && producto._id.toString() === idProducto.toLowerCase()
      );
      return productoEncontrado ? productoEncontrado.Nombre : ""; // Devuelve el nombre si se encuentra, de lo contrario, una cadena vacía
    }

    setItems((prevItems) => {
      // Mapea los items y actualiza el nombre del producto
      return prevItems.map((item) => ({
        ...item,
        NombreProducto: nombreProducto(item.Producto),
      }));
    });
  }, [producto, items]);

  /** Handle para tomado */

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

  /** Actualizar Empleado que despacha */
  const handleActualizarPedido = async (name) => {
    try {
      await EditarPedidoRequest(pedido._id, { Empaco: name });
      // Realizar cualquier otra acción necesaria después de actualizar el pedido
      console.log('Pedido actualizado');
    } catch (error) {
      console.error('Error al actualizar el pedido:', error);
    }
  }

  return (
    <div className="bg-slate-300 rounded-md p-1 relative">
      {pedido.Empaco &&  (
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

        <h2 className="mx-4 text-sm font-bold">{clienteEncontrado.Nombre}</h2>
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
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={index}
                  className="text-center text-black odd:bg-white odd:dark:bg-gray-300 even:bg-gray-50 even:dark:bg-gray-400 border-b dark:border-gray-500"
                >
                  <td>
                    <h6>{item.Cantidad}</h6>
                  </td>
                  <td>
                    <span>{item.Peso}</span>
                  </td>
                  <td>
                    <span>{item.NombreProducto}</span>
                  </td>
                  <td>
                    <span>{item.Observaciones}</span>
                  </td>
                </tr>
              ))}
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
              handleEmpacado(pedido._id, {
                
                Estado: true,
              });
              handleRefrescar(); // Llamar a handleRefrescar después de handleEmpacado
            }}
          >
            Empacado
          </button>

          <button
            className="bg-yellow-600 px-2 py-1 text-white"
            onClick={handleEditar}
          >
            Editar
          </button>

          <button
            className="bg-lime-900  px-2 py-1 text-white"
            onClick={handleTomadoClick}
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
                    Seleccione su nombre
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
                    setNombreEmpleado(values.nombre);
                    handleActualizarPedido(values.nombre)
                    setShowTomadoModal(false);
                  }}
                >
                  {(formik) => (
                    <Form className="p-4 md:p-5">
                    <label htmlFor="nombre">Nombre del empleado:</label>
                    <Field
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-red-200 dark:border-gray-500 dark:placeholder-gray-800 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      as="select"
                      id="nombre"
                      name="nombre"
                      placeholder="Nombre del empleado"
                    >
                      <option value="">Seleccione un empleado</option>
                      <option value="empleado1">Empleado 1</option>
                      <option value="empleado2">Empleado 2</option>
                      {/* Agrega más opciones según sea necesario */}
                    </Field>
                    <button
                        class="text-white  my-4 mx-28 inline-flex items-center bg-orange-400 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-400 dark:hover:bg-amber-600 dark:focus:ring-orange-500"
                        type="submit">Aceptar</button>
                  </Form>
                  )}
                </Formik>
              </Modal>
            </div>
          )}
        </div>
        {/**Modal Editar */}
        <Modal
          style={customStyles}
          isOpen={mostrarModal}
          onClose={handleCloseModal}
        >
          <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Editar Pedido
            </h3>
            <button
              type="button"
              onClick={handleCloseModal}
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
          {/* Contenido del modal */}

          <Formik
            initialValues={{
              Cliente: datosPedido.Cliente && datosPedido.Cliente.Nombre,
              Cantidad: pedido.Cantidad || 0,
              Peso: pedido.Peso || "",
              Producto: datosPedido.Producto && datosPedido.Producto.Nombre,
              Observaciones: pedido.Observaciones || "",
            }}
            onSubmit={(values) => {
              // Lógica para enviar los datos del formulario

              editarPedido(pedido._id, {
                Cliente: pedido.Cliente,
                Producto: pedido.Producto,
                Cantidad: values.Cantidad,
                Peso: values.Peso,
                Observaciones: values.Observaciones,
              });
              console.log(values, pedido._id);
              handleCloseModal();
            }}
          >
            <Form class="p-4 md:p-5">
              <div>
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="Cliente"
                >
                  Cliente
                </label>
                <Field
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-red-200 dark:border-gray-500 dark:placeholder-gray-800 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  type="text"
                  id="Cliente"
                  name="Cliente"
                  readOnly
                />
                <ErrorMessage name="Cliente" component="div" />
              </div>

              <div>
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="Cantidad"
                >
                  Cantidad
                </label>
                <Field
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-red-200 dark:border-gray-500 dark:placeholder-gray-800 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  type="text"
                  id="Cantidad"
                  name="Cantidad"
                />
                <ErrorMessage name="Cantidad" component="div" />
              </div>

              <div>
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="Peso"
                >
                  Peso
                </label>
                <Field
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-red-200 dark:border-gray-500 dark:placeholder-gray-800 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  type="text"
                  id="Peso"
                  name="Peso"
                />
                <ErrorMessage name="Peso" component="div" />
              </div>

              <div>
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="Producto"
                >
                  Producto
                </label>
                <Field
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-red-200 dark:border-gray-500 dark:placeholder-gray-800 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  type="text"
                  id="Producto"
                  name="Producto"
                  readOnly
                />
                <ErrorMessage name="Producto" component="div" />
              </div>

              <div>
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="Observaciones"
                >
                  Observaciones
                </label>
                <Field
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-red-200 dark:border-gray-500 dark:placeholder-gray-800 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  type="textarea"
                  id="Observaciones"
                  name="Observaciones"
                />
                <ErrorMessage name="Observaciones" component="div" />
              </div>

              {/* Resto de los campos del formulario... */}

              <button
                class="text-white  my-4 mx-28 inline-flex items-center bg-orange-400 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-400 dark:hover:bg-amber-600 dark:focus:ring-orange-500"
                type="submit"
              >
                Editar
              </button>
            </Form>
          </Formik>
        </Modal>
      </div>
    </div>
  );
}

export default PedidoCard;