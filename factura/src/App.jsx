
import React from 'react';
import PdfCotizacion from './Cotizacion';
import PdfFactura from './Factura';
import PdfGuia from './Guia';
import './App.css';
import { printA4 } from './A4'


const App = () => {
  const handleCreatePDF = () => {
    printA4();
  };

  return (
    <div>
      <h1>Pdf A4</h1>
      <button onClick={handleCreatePDF}>Crear Pdf </button>
    </div>
  );
};

export default App;




// App.js

/*function App() {
  return (
    <div className="App">
      <h1>Generar PDF Comprobantes</h1>
      <PdfGuia/>
      <p>

      </p>
      <PdfFactura/>
      <p>

      </p>
      <PdfCotizacion />      
    </div>
  );
}

export default App;*/
