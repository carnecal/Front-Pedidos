import { BrowserRouter } from "react-router-dom"
import NavBar from "./components/NavBar"
import MyRoutes from "./routers/MyRoutes"
import { PedidosContextProvider } from "./Context/PedidosProvider"


function App() {
  return (
    
  <div className="min-h-screen bg-gradient-to-b from-orange-700 to-red-500">
    <NavBar/>
  <div className="container mx-auto py-4 px-10">
  <PedidosContextProvider>
   
    <MyRoutes/>
   </PedidosContextProvider>
  </div>
  </div>
   
   
  )
}


export default App;

