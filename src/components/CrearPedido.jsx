import { ErrorMessage, Field, Form, Formik } from "formik";
import { CrearPedidoRequest } from "../api/Pedido.api";
import { ConsultarClientes, ConsultarClientexCodigo } from "../api/Cliente.api";
import { useEffect, useState } from "react";
import { ConsultarProductosRequest } from "../api/Productos.api";
import { ConsultarEmpleadoRequest } from "../api/Empleados.api";
import { usePedidos } from "../Context/PedidosProvider";
import Modal from "react-modal";
import ModalCrearCliente from "./ModalCrearCliente";

const initialValues = {
  Cliente: "",
  Cantidad: "",
  Peso: "",
  Producto: "",
  Observaciones: "",
  Recibio: "",
};

function CrearPedido() {
  const {
    clientes,
    productos,
    empleados,
    cargarClientes,
    cargarProductos,
    cargarEmpleados,
    crearPedido,
    handleRefresh,
  } = usePedidos();

  /** Consulta Clientes */
  useEffect(() => {
    cargarClientes();
  }, []);

  /** Consulta Productos */
  useEffect(() => {
    cargarProductos();
  }, []);

  /**Consulta Empleados */
  useEffect(() => {
    cargarEmpleados();
  }, []);/** Estados para Controlar los clientes */
  const [clienteExistente, setClienteExistente] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(false);

  //** Onchange del campo Ciente */

  const MIN_CHARS_FOR_SEARCH = 5

  const handleInputChangeCliente = (event) => {
    const inputValue = event.target.value.toLowerCase().trim();
    setInputValue(inputValue); // Actualiza el estado del valor del input
    
    // Verifica si el campo de entrada contiene al menos cierta cantidad de caracteres para realizar la búsqueda
    if (inputValue.length >= MIN_CHARS_FOR_SEARCH) {
      // Realiza la búsqueda en la base de datos para verificar si el cliente existe
      const clienteEncontrado = clientes.find(
        (cliente) => cliente.Codigo.toLowerCase() === inputValue
      );
    
      if (clienteEncontrado) {
        setClienteExistente(clienteEncontrado);
        setShowModal(false);
      } else {
        setClienteExistente(null);
        setMostrarModal(true);
      }
    } else {
      // Si no se han ingresado suficientes caracteres, no hagas nada
      setClienteExistente(null);
      setMostrarModal(false);
    }
  };
  
  const handleInputBlurCliente = (event) => {
    const inputValue = event.target.value.toLowerCase().trim();
    
    // Realiza la búsqueda en la base de datos solo si el campo de entrada ha perdido el foco y no hay suficientes caracteres
    if (inputValue.length < MIN_CHARS_FOR_SEARCH) {
      // Realiza la búsqueda en la base de datos para verificar si el cliente existe
      const clienteEncontrado = clientes.find(
        (cliente) => cliente.Codigo.toLowerCase() === inputValue
      );
    
      if (!clienteEncontrado) {
        setMostrarModal(true);
      } else {
        setMostrarModal(false);
      }
    }
  };
  /** Estados para los Cortes  */
  const [productoExistente, setProductoExistente] = useState(null);
  const [inputValue2, setInputValue2] = useState("");
  const [showModal2, setShowModal2] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleInputChange2 = (event) => {
    const inputValue2 = event.target.value.toLowerCase();
    setInputValue2(inputValue2);

    // Realiza la búsqueda en la base de datos para verificar si el producto existe
    const productoEncontrado = productos.find(
      (producto) => producto.Codigo.toLowerCase() === inputValue2
    );

    if (productoEncontrado) {
      setProductoExistente(productoEncontrado);
      setShowModal2(false);
    } else {
      setProductoExistente(null);
      setShowModal2(true);
      setShowModal(true);
    }
  };

  /** Estados para los Empleados */
  /** Estados para los Cortes  */
  const [empleadoExistente, setEmpleadoExistente] = useState(null);
  const [inputValue3, setInputValue3] = useState("");
  const [showModal3, setShowModal3] = useState(false);

  const handleInputChange3 = (event) => {
    const inputValue3 = event.target.value.toLowerCase();
    setInputValue3(inputValue3);

    // Realiza la búsqueda en la base de datos para verificar si el producto existe
    const empleadoEncontrado = empleados.find(
      (empleado) => empleado.Cedula.toLowerCase() === inputValue3
    );

    if (empleadoEncontrado) {
      setEmpleadoExistente(empleadoEncontrado);
      setShowModal3(false);
    } else {
      setEmpleadoExistente(null);
      setShowModal3(true);
    }
  };

  const handleRecargaPedidos = () => {
    // Recargar otra página
    window.location.href = "./PedidosCola";
  };

  const handleCloseModal = () => {
    setMostrarModal(false);
  };

  /** Todo lo correspondiente con el Modal para crear cliente */
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

  return (
    <div c>
      <h1 className="text-2xl text-white font-bold text-center py-4">
        Crear Pedido
      </h1>
      <Formik
        initialValues={initialValues}
        validate={(values) => {
          const errors = {};
          // Aquí podrías agregar validaciones personalizadas si es necesario
          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          // Aquí manejarías la lógica para enviar los datos del formulario
          values.Cliente = clienteExistente._id;
          values.Producto = productoExistente._id;
          values.Recibio = empleadoExistente._id;

          crearPedido(values);

          resetForm();
          setInputValue(""); // Limpiar el estado del campo de entrada del cliente
          setInputValue2(""); // Limpiar el estado del campo de entrada del producto
          setInputValue3(""); // Limpiar el estado del campo de entrada del empleado
          setClienteExistente(null); // Limpiar el estado del cliente existente
          setProductoExistente(null); // Limpiar el estado del producto existente
          setEmpleadoExistente(null); // Limpiar el estado del empleado existente

          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="bg-slate-300 p-4 border">
            <div>
              <label
                for="Cliente"
                className="px-3 block mb-2 text-lg font-medium text-gray-900 dark:text-black"
              >
                Cliente
              </label>

              <input
                className=" px-4 py-2 bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-800 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="text"
                id="cliente"
                name="Cliente"
                value={inputValue}
                onChange={handleInputChangeCliente} // Asignar handleInputChangeCliente al evento onChange
                onBlur={handleInputBlurCliente}
                placeholder="Buscar cliente por código"
              />
              <div>
                {/* Muestra los detalles del cliente si existe */}
                {clienteExistente && <div>{clienteExistente.Nombre}</div>}
                {console.log(clienteExistente?.Nombre, showModal)}
                {/* Muestra el modal si el cliente no existe */}
                {!clienteExistente && (
                  <Modal
                    style={customStyles}
                    isOpen={mostrarModal}
                    onClose={handleCloseModal}
                  >
                     <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        Registrar Cliente
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

                    

                    <Form class="p-4 md:p-5">
              

              <div>
                <label
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="Cantidad"
                >
                  Nombre
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
                  Nit
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
                  htmlFor="Observaciones"
                >
                  Código
                </label>
                <Field
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-red-200 dark:border-gray-500 dark:placeholder-gray-800 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  type="text"
                  id="Observaciones"
                  name="Observaciones"
                />
                <ErrorMessage name="Observaciones" component="div" />
              </div>

              {/* Resto de los campos del formulario... */}

              <button
                class="text-white  my-4 mx-28 inline-flex items-center bg-orange-400 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-400 dark:hover:bg-amber-600 dark:focus:ring-orange-500"
                type="submit"
                onClick={handleCloseModal}
              >
                Crear Cliente
              </button>
            </Form>
                  </Modal>
                )}
              </div>
              <ErrorMessage name="cliente" component="div" />
            </div>

            <div>
              <label
                className="px-3 block mb-2 text-lg font-medium text-gray-900 dark:text-black"
                htmlFor="Cantidad"
              >
                Cantidad
              </label>
              <Field
                className=" px-4 py-2 bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-800 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="number"
                name="Cantidad"
                disabled={showModal}
              />
              <ErrorMessage name="cantidad" component="div" />
            </div>

            <div>
              <label
                className="px-3 block mb-2 text-lg font-medium text-gray-900 dark:text-black"
                htmlFor="Peso"
              >
                Peso
              </label>
              <Field
                className=" px-4 py-2 bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-800 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="text"
                name="Peso"
                disabled={showModal}
              />
              <ErrorMessage name="peso" component="div" />
            </div>

            <div>
              <label
                className="px-3 block mb-2 text-lg font-medium text-gray-900 dark:text-black"
                htmlFor="Producto"
              >
                Corte
              </label>
              <input
                className=" px-4 py-2 bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-800 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="text"
                id="corte"
                name="Producto"
                value={inputValue2}
                onChange={handleInputChange2}
                placeholder="Buscar corte por código"
                disabled={showModal}
              />
              <div>
                {/* Muestra los detalles del producto si existe */}
                {productoExistente && (
                  <div>
                    {productoExistente.Codigo} - {productoExistente.Nombre}
                  </div>
                )}
              </div>
              <ErrorMessage name="corte" component="div" />
            </div>

            <div>
              <label
                className="px-3 block mb-2 text-lg font-medium text-gray-900 dark:text-black"
                htmlFor="Observaciones"
              >
                Observaciones
              </label>
              <Field
                className=" px-4 py-2 bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-800 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                as="textarea"
                name="Observaciones"
                disabled={showModal}
              />
              <ErrorMessage name="observaciones" component="div" />
            </div>

            <div>
              <label
                className="px-3 block mb-2 text-lg font-medium text-gray-900 dark:text-black"
                htmlFor="Recibio"
              >
                Recibe:{" "}
              </label>
              <input
                className=" px-4 py-2 bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-800 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="text"
                id="recibio"
                name="Recibio"
                value={inputValue3}
                onChange={handleInputChange3}
                placeholder="Buscar empleado por código"
                disabled={showModal}
              />
              <div>
                {/* Muestra los detalles del producto si existe */}
                {empleadoExistente && (
                  <div>
                    {empleadoExistente.Codigo} - {empleadoExistente.Nombre}
                  </div>
                )}
              </div>
              <ErrorMessage name="recibioPedido" component="div" />
            </div>
            {/* Renderiza el mensaje si el cliente no existe */}
            {showModal && (
              <div>
                <p>El cliente no existe.</p>
              </div>
            )}

            {showModal2 && (
              <div>
                <p>El producto no existe</p>
              </div>
            )}
            <button
              class="text-white bg-gradient-to-r mt-4 mx-60  from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              type="submit"
            >
              Guardar
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CrearPedido;
