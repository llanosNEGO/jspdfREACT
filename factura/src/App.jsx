
import React from 'react';
import PdfCotizacion from './Cotizacion';
import PdfFactura from './Factura';
import PdfGuia from './Guia';
import './App.css';

// App.js

function App() {
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

export default App;
