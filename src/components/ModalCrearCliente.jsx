import React from 'react';

const ModalCrearCliente = () => {
 

  return (
  <>
  
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
  </>
    

  );
};

export default ModalCrearCliente;