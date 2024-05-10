import { ErrorMessage, Field, Form, Formik } from "formik";
import { CrearPedidoRequest } from "../api/Pedido.api";
import {
  ConsultarClientes,
  ConsultarClientexCodigo,
  CrearCliente,
} from "../api/Cliente.api";
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
  ObservacionesG: "",
  Recibio: "",
};

function CrearPedidoAlterno() {
  const {
    clientes,
    productos,
    empleados,
    cargarClientes,
    cargarProductos,
    cargarEmpleados,
    crearPedido,
    crearCliente,
    handleRefresh,
  } = usePedidos();

/** RECARGA PAGE DESPUES DE ABRIR MODAL Y CREAR CLIENTE */

 // Estado para controlar si se debe recargar la página
 const [clientesActualizados, setClientesActualizados] = useState(false);

 // Efecto para detectar cambios en la lista de clientes
 useEffect(() => {
   if (clientesActualizados) {
     // Recargar la página si se detecta un cambio en la lista de clientes
     window.location.reload();
     setClientesActualizados(false); // Restablecer el estado después de recargar la página
   }
 }, [clientesActualizados]);

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
  }, []);
  /** Estados para Controlar los clientes */
  const [clienteExistente, setClienteExistente] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(false);

  //** Onchange del campo Ciente */

  const MIN_CHARS_FOR_SEARCH = 5;

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

  const MIN_CHARS_FOR_SEARCH_PRODUCT = 5; // Define el número mínimo de caracteres para buscar un producto

  const handleInputChange2 = (event, index) => {
    const { value } = event.target;

    // Creamos una copia del array de items
    const updatedItems = [...items];

    // Actualizamos el valor del campo Producto para el ítem en la posición 'index'
    updatedItems[index] = {
      ...updatedItems[index],
      Producto: value,
    };

    // Realiza la búsqueda en la base de datos para verificar si el producto existe
    const inputValue = value.toLowerCase().trim();
    if (inputValue.length >= MIN_CHARS_FOR_SEARCH_PRODUCT) {
      const productoEncontrado = productos.find(
        (producto) =>
          producto.Codigo.toLowerCase() === inputValue ||
          producto.Nombre.toLowerCase() === inputValue
      );

      if (productoEncontrado) {
        // Actualiza solo el campo de producto del ítem específico
        updatedItems[index] = {
          ...updatedItems[index],
          Producto: productoEncontrado._id, // Actualiza solo con el objeto del producto encontrado
        };
        setProductoExistente(productoEncontrado);
        setShowModal2(false);
      } else {
        setProductoExistente(null);
        setShowModal2(true);
        setShowModal(true);
      }
    } else {
      setProductoExistente(null);
      setShowModal2(false);
    }

    // Actualizamos el estado 'items' con la nueva lista de ítems actualizada
    setItems(updatedItems);
  };

  const handleInputBlurProducto = (index) => {
    // Verificamos si el producto existe en la base de datos
    const inputValue = items[index].Producto.toLowerCase().trim();
    if (
      inputValue.length < MIN_CHARS_FOR_SEARCH_PRODUCT &&
      inputValue.length >= MIN_CHARS_FOR_SEARCH_PRODUCT
    ) {
      // Realiza la búsqueda en la base de datos para verificar si el producto existe
      const productoEncontrado = productos.find(
        (producto) => producto.Codigo.toLowerCase() === inputValue
      );
      console.log("Producto encontrado:", productoEncontrado);

      if (!productoEncontrado) {
        // Si el producto no existe, mostramos el modal
        setShowModal2(true);
      } else {
        setShowModal2(false);
      }
    }
  };

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

  const handleCloseModalProducto = () => {
    setShowModal2(false);
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

  const [items, setItems] = useState([]);
  /** Elementos de la tabla */
  const [newItem, setNewItem] = useState({
    Cantidad: "",
    Peso: "",
    Producto: "",
    Observaciones: "",
  });

  const addItem = () => {
    setItems((prevItems) => [...prevItems, { ...newItem }]); // Agregar newItem a items
    setNewItem({
      // Reiniciar newItem para limpiar los campos del formulario
      Cantidad: "",
      Peso: "",
      Producto: "",
      Observaciones: "",
    });
  };

  const removeItem = (indexToRemove) => {
    setItems((prevItems) =>
      prevItems.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleItemChange = (index, newItem) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems]; // Copiar el array de items
      updatedItems[index] = newItem; // Actualizar el ítem específico en el índice dado
      return updatedItems; // Devolver el nuevo array actualizado
    });
  };

  /** MANEJO DE MENSAJES DE EXITO */
  const [mostrarClienteCreado, setMostrarClienteCreado] = useState(false);
  const [mostrarCPedidoCreado, setMostrarPedidoCreado] = useState(false);

  const handleHiderClienteCreado = () => {
    setTimeout(() => {
      setMostrarClienteCreado(false);
    }, 3000); // Ocultar el mensaje después de 3 segundos
  };
  const handleHidePedidoCreado = () => {
    setTimeout(() => {
      setMostrarPedidoCreado(false);
    }, 3000); // Ocultar el mensaje después de 3 segundos
  };
  return (
    <div>
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
          values.Recibio = empleadoExistente._id;
          console.log(values.ObservacionesG);
          const ObsG = values.ObservacionesG;

          /** Cambiando valores a Objeto Pedido */
          const pedidoDto1 = {
            Cliente: clienteExistente._id,
            Recibio: empleadoExistente._id,
            Observaciones_Generales: ObsG,
            Items: items.map((item) => ({
              // Accede directamente a items desde el estado
              Cantidad: item.Cantidad,
              Peso: item.Peso,
              Producto: item.Producto, // Verificar si productoExistente no es null antes de acceder a su propiedad _id
              Observaciones: item.Observaciones,
            })),
          };

          crearPedido(pedidoDto1);
          setMostrarPedidoCreado(true);
          handleHidePedidoCreado();

          resetForm();
          setInputValue(""); // Limpiar el estado del campo de entrada del cliente
          setInputValue2(""); // Limpiar el estado del campo de entrada del producto
          setInputValue3(""); // Limpiar el estado del campo de entrada del empleado
          setClienteExistente(null); // Limpiar el estado del cliente existente
          setProductoExistente(null); // Limpiar el estado del producto existente
          setEmpleadoExistente(null); // Limpiar el estado del empleado existente
          setItems([]); // Limpiar la tabla

          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="bg-slate-300 p-4 border">
            {/**Campo Cliente */}
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

                    <Formik
                      className="p-4 md:p-5"
                      initialValues={{ nombre: "", nit: "", codigo: "" }}
                      onSubmit={(values) => {
                        const cliente = {
                          Nombre: values.nombre,
                          Nit: values.nit,
                          Codigo: values.codigo,
                        };
                        console.log("Cliente", cliente);
                        CrearCliente(cliente);
                        handleCloseModal();
                        setMostrarClienteCreado(true);
                        handleHiderClienteCreado();
                        setClientesActualizados(true)
                      }}
                    >
                      {() => (
                        <Form>
                          <div>
                            <label
                              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              htmlFor="Cantidad"
                            >
                              Nombre
                            </label>
                            <Field
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-red-200 dark:border-gray-500 dark:placeholder-gray-800 dark:text-black dark:focus:ring-primary-500 dark:focus:border-primary-500"
                              type="text"
                              id="nombre"
                              name="nombre"
                            />
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
                              type="numeric"
                              id="nit"
                              name="nit"
                            />
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
                              id="codigo"
                              name="codigo"
                            />
                          </div>

                          {/* Resto de los campos del formulario... */}

                          <button
                            class="text-white  my-4 mx-28 inline-flex items-center bg-orange-400 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-orange-400 dark:hover:bg-amber-600 dark:focus:ring-orange-500"
                            type="submit"
                          >
                            Crear Cliente
                          </button>
                        </Form>
                      )}
                    </Formik>
                  </Modal>
                )}
              </div>
              <ErrorMessage name="cliente" component="div" />
            </div>
            {/**Campo Item */}
            {/** CReando nuevo item a traves de una tabla */}
            <br />
            <label className="px-3 block mb-2 text-lg font-medium text-gray-900 dark:text-black">
              Pedido
            </label>
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg  border border-gray-500">
              <table class="w-full text-sm text-left rtl:text-right bg-slate-300 text-gray-500 dark:text-gray-400 ">
                <thead class="text-xs text-black uppercase  bg-slate-200 dark:text-gray-800">
                  <tr></tr>
                  <tr>
                    <th scope="col" class="px-6 py-3">
                      Cantidad
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Peso
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Corte
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Observaciones
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr
                      key={index}
                      class="odd:bg-white odd:dark:bg-gray-300 even:bg-gray-50 even:dark:bg-gray-400 border-b dark:border-gray-500"
                    >
                      <td class="px-6 py-4">
                        <Field
                          className=" px-4 py-2 bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-800 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          type="text"
                          name="Cantidad"
                          value={item.Cantidad} // Usar el valor del ítem actual en lugar de newItem
                          onChange={(e) =>
                            handleItemChange(index, {
                              ...item,
                              Cantidad: e.target.value,
                            })
                          }
                          disabled={showModal}
                        />
                        <ErrorMessage name="cantidad" component="div" />
                      </td>
                      <td class="px-6 py-4">
                        <Field
                          as="select"
                          className="px-4 py-2 bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-800 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          name={`items[${index}].Peso`}
                          value={item.Peso || ""}
                          onChange={(e) =>
                            handleItemChange(index, {
                              ...item,
                              Peso: e.target.value,
                            })
                          }
                        >
                          <option value="">Selecciona una opción</option>
                          <option value="Unidad">Unidad</option>
                          <option value="Libra">Libra</option>
                          <option value="Gramos">Gramos</option>
                          <option value="Kilo">Kilo</option>
                        </Field>
                        <ErrorMessage
                          name={`items[${index}].Peso`}
                          component="div"
                        />
                      </td>
                      <td class="px-6 py-4">
                        <Field
                          className=" px-4 py-2 bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-800 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          name="Producto" // Agrega el name para identificar el campo
                          type="text"
                          value={item.Producto ? item.Producto.Codigo : ""}
                          onChange={(e) => handleInputChange2(e, index)}
                          placeholder="Buscar corte por código"
                          onBlur={() => handleInputBlurProducto(index)}
                        />

                        <ErrorMessage name={`items[${index}].Producto`} />
                      </td>
                      <td class="px-6 py-4">
                        <Field
                          className=" px-4 py-2 bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-800 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          as="textarea"
                          name="Observaciones"
                          value={item.Observacones} // Usar el valor del ítem actual en lugar de newItem
                          onChange={(e) =>
                            handleItemChange(index, {
                              ...item,
                              Observaciones: e.target.value,
                            })
                          }
                        />
                        <ErrorMessage name={`items[${index}].Observaciones`} />
                      </td>

                      <td class="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-200 dark:text-gray-500 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className=" ">
              <button
                type="button"
                onClick={addItem}
                className="py-2.5 px-5  me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-200 dark:text-gray-500 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Agregar ítem
              </button>
              {/* Muestra los detalles del producto si existe */}

              {productoExistente && (
                <span className="py-2.5 px-5  me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-red-400 rounded-lg border border-gray-200 focus:ring-gray-100 dark:bg-red-200 dark:text-gray-500 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                  {" "}
                  Nombre producto: {productoExistente.Nombre}
                </span>
              )}
            </div>
            {/**Campo Observaciones Generales */}
            <div>
              <label className="px-3 block mb-2 text-lg font-medium text-gray-900 dark:text-black">
                Observaciones Generales
              </label>
              <Field
                className=" px-4 py-2 bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-800 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                as="textarea"
                name="ObservacionesG"
                placeholder="Ingrese Observaciones Generales al Pedido"
              />
            </div>
            {/**Campo Recibe */}
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
              />
              <div>
                {/* Muestra los detalles del producto si existe */}
                {empleadoExistente && (
                  <div>
                    {empleadoExistente.Nombre}
                  </div>
                )}
              </div>
              <ErrorMessage name="recibioPedido" component="div" />
            </div>

            {/* Renderiza el mensaje si el cliente no existe */}

            {showModal2 && (
              <div>
                <Modal
                  style={customStyles}
                  isOpen={showModal2}
                  onClose={handleCloseModalProducto}
                >
                  <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      Producto no existe
                    </h3>
                    <button
                      type="button"
                      onClick={handleCloseModalProducto}
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
                </Modal>
              </div>
            )}

            {/** MODAL PEDIDO CREADO */}
            {mostrarCPedidoCreado && (
              <div>
                <Modal style={customStyles} isOpen={mostrarCPedidoCreado}>
                  <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      Pedido Creado exitosamente!!
                    </h3>
                  </div>
                </Modal>
              </div>
            )}

            {/** MODAL ClIENTE CREADO */}
            {mostrarClienteCreado && (
              <div>
                <Modal style={customStyles} isOpen={mostrarClienteCreado}>
                  <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      Cliente registrado exitosamente!!
                    </h3>
                  </div>
                </Modal>
              </div>
            )}
            <div className=" grid content-center ">
              <button
                class="text-white bg-gradient-to-r mt-4   from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                type="submit"
              >
                Guardar
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CrearPedidoAlterno;
