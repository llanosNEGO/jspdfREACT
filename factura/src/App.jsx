
import React from 'react';
//import PdfCotizacion from './Cotizacion';
import PdfFactura from './Factura';
//import PdfGuia from './Guia';
import './App.css';
import  crearDocPDF  from './NFactura.jsx'


function App() {
  const handleGenerarPDF = () => {
    const DetallesVenta = [
      {
        "IdDetalleVenta": 1556,
        "IdRegistroVenta": 572,
        "Cantidad": 5,
        "NombreProducto": "CUBIERTOS ACERO 24 PIEZAS PRINCIPAL NIU",
        "IdStock": 1088,
        "IdTipoStock": 1,
        "IdAfectacionIgv": 1,
        "PrecioVenta": 97.999999,
        "Importe": 489.999995,
        "Codigo": "P0000036",
        "Indice": 1,
        "Unidad": "UNIDAD",
        "Descuento": 0,
        "NombreProductoUnidad": "CUBIERTOS ACERO 24 PIEZAS  NIU",
        "NombreProductoUnidadPrecio": "CUBIERTOS ACERO 24 PIEZAS  UNIDAD  X S/ 98.00",
        "afectacionFree": 0
      },
      {
        "IdDetalleVenta": 1557,
        "IdRegistroVenta": 572,
        "Cantidad": 3,
        "NombreProducto": "TETERA HERBIDORA 3L AZUL PRINCIPAL NIU",
        "IdStock": 933,
        "IdTipoStock": 1,
        "IdAfectacionIgv": 1,
        "PrecioVenta": 42,
        "Importe": 126,
        "Codigo": "P0000031",
        "Indice": 2,
        "Unidad": "UNIDAD",
        "Descuento": 0,
        "NombreProductoUnidad": "TETERA HERBIDORA 3L AZUL  NIU",
        "NombreProductoUnidadPrecio": "TETERA HERBIDORA 3L AZUL  UNIDAD  X S/ 42.00",
        "afectacionFree": 0
      },
      {
        "IdDetalleVenta": 1558,
        "IdRegistroVenta": 572,
        "Cantidad": 17,
        "NombreProducto": "URBANAS REEBOK REWIND RUN PRINCIPAL NIU",
        "IdStock": 747,
        "IdTipoStock": 1,
        "IdAfectacionIgv": 1,
        "PrecioVenta": 85,
        "Importe": 1445,
        "Codigo": "P0000025",
        "Indice": 3,
        "Unidad": "UNIDAD",
        "Descuento": 0,
        "NombreProductoUnidad": "URBANAS REEBOK REWIND RUN  NIU",
        "NombreProductoUnidadPrecio": "URBANAS REEBOK REWIND RUN  UNIDAD  X S/ 85.00",
        "afectacionFree": 0
      },
      {
        "IdDetalleVenta": 1559,
        "IdRegistroVenta": 572,
        "Cantidad": 80,
        "NombreProducto": "ZAPATILLAS URBANAS HOMBRE PUMA  PRINCIPAL NIU",
        "IdStock": 685,
        "IdTipoStock": 1,
        "IdAfectacionIgv": 1,
        "PrecioVenta": 120,
        "Importe": 9600,
        "Codigo": "P0000023",
        "Indice": 4,
        "Unidad": "UNIDAD",
        "Descuento": 0,
        "NombreProductoUnidad": "ZAPATILLAS URBANAS HOMBRE PUMA   NIU",
        "NombreProductoUnidadPrecio": "ZAPATILLAS URBANAS HOMBRE PUMA   UNIDAD  X S/ 120.00",
        "afectacionFree": 0
      },
      {
        "IdDetalleVenta": 1560,
        "IdRegistroVenta": 572,
        "Cantidad": 47,
        "NombreProducto": "HUAWEI P30  PRINCIPAL NIU",
        "IdStock": 468,
        "IdTipoStock": 1,
        "IdAfectacionIgv": 1,
        "PrecioVenta": 1250,
        "Importe": 58750,
        "Codigo": "P0000016",
        "Indice": 5,
        "Unidad": "UNIDAD",
        "Descuento": 0,
        "NombreProductoUnidad": "HUAWEI P30   NIU",
        "NombreProductoUnidadPrecio": "HUAWEI P30   UNIDAD  X S/ 1250.00",
        "afectacionFree": 0
      },
      {
        "IdDetalleVenta": 1561,
        "IdRegistroVenta": 572,
        "Cantidad": 3,
        "NombreProducto": "TELEVISOR JVC LED PRINCIPAL NIU",
        "IdStock": 499,
        "IdTipoStock": 1,
        "IdAfectacionIgv": 1,
        "PrecioVenta": 50,
        "Importe": 150,
        "Codigo": "P0000017",
        "Indice": 6,
        "Unidad": "UNIDAD",
        "Descuento": 0,
        "NombreProductoUnidad": "TELEVISOR JVC LED  NIU",
        "NombreProductoUnidadPrecio": "TELEVISOR JVC LED  UNIDAD  X S/ 50.00",
        "afectacionFree": 0
      }
    ];

    const Venta = 
      {
        "FechaEmision": "2024-06-19 21:43:29",
        "IdRegistroVenta": 572,
        "CodigoDocumentoCliente": 6,
        "NroTipoDocumento": "20539952413",
        "RazonSocial": "ESCOBEDO MEDINA AUDITORES ASOCIADOS S.CIVIL DE R.L.",
        "ClienteDireccion": "CAL. ARGENTINA URB. EL RECREO ET. 2 131",
        "TipoComprobante": "BOLETA DE VENTA ELECTRONICA",
        "Serie": "FE01",
        "Correo": "Venta@mifacturaperu.com",
        "NumeroComprobante": "0000020",
        "IdProceso": "662",
        "Proceso": "Preventas",
        "Estado": null,
        "IdMoneda": 1,
        "Abreviatura": "SOL",
        "Simbolo": "S/",
        "Redondeo": 0.000005,
        "Gravadas": 59797.457623,
        "Exoneradas": 0,
        "Inafectas": 0,
        "ICBPER": 0,
        "IGV": 10763.542372,
        "Exportacion": 0,
        "Total": 70560.999995,
        "TotalRedondeo": 70560.99999,
        "DescuentoTotal": 0,
        "Vuelto": 0,
        "VueltoRedondeo": 0.000005,
        "Gratuitas": 0,
        "ISC": 0,
        "IVAP": 0,
        "Letras": "SETENTA  MIL QUINIENTOS SESENTA Y UNO CON 00/100 SOLES",
        "Sucursal": "LIMA",
        "DireccionSucursal": "AV. REPÚBLICA DE PANAMÁ URB. LIMATAMBO 4050",
        "Empresa": "COCA-COLA SERVICIOS DE PERU S.A",
        "Direccion": "AV. REPÚBLICA DE PANAMÁ URB. LIMATAMBO 4050  CAJAMARCA - CAJAMARCA - CAJAMARCA",
        "Ruc": "20415932376",
        "Logo": null,
        "TelefonoDos": "854966666",
        "TelefonoTres": "6558842814",
        "IdModalidadPago": "CONTADO",
        "CantidadDiasCredito": "-",
        "FechaPago": "-",
        "Observacion": "OBSERVACIONES:",
        "CodigoTipoComprobante": 1,
        "IdTipoDocumentoSunat": 2,
        "IdtipoDocumentoCliente":1,
        "Alias": "",
        "NombreEmpleado": "DENIS",
        "ApellidoEmpleado": "SANCHEZ",
        "NombreCaja": "CAJA-LIMA-1",
        "Ubigeo": "130101",
        "Celular": "",
        "DireccionCliente": "CAL. ARGENTINA URB. EL RECREO ET. 2 131",
        "aliasPlaca": "",
        "metadata": "{}",
        "retencion": 0,
        "IdGuiaRemision": null,
        "OrdenCompra": "",
        "descItems": 0,
        "Consultadocumento":"PARA CONSULTAR EL DOCUMENTO VISITA WWW.MIFACTURAPERU.COM   CERTIFICADO PSE POR SUNAT",
        "Representacion":"Representacion impresa del comprobante",  
        "Cuentas":"NUMEROS DE CUENTA",    

      };   
    const cuentasBancarias = [
      {
        
        "IdNumerosCuenta": 1,
        "IdEmpresa": 2,
        "IdMoneda": 1,
        "Banco": "BCP",
        "NumeroCTA": "256161616514984",
        "CCI": "00006584964964064",
        "Moneda": "SOLES"
      },
      {
        
        "IdNumerosCuenta": 2,
        "IdEmpresa": 2,
        "IdMoneda": 2,
        "Banco": "BCP",
        "NumeroCTA": "5146146846274514",
        "CCI": "0000064869849849849849",
        "Moneda": "DÓLARES AMERICANOS"
      },
      {
        
        "IdNumerosCuenta": 3,
        "IdEmpresa": 2,
        "IdMoneda": 1,
        "Banco": "BBVA",
        "NumeroCTA": "468464641646584646",
        "CCI": "5146146135164114",
        "Moneda": "SOLES"
      },
      {
        
        "IdNumerosCuenta": 4,
        "IdEmpresa": 2,
        "IdMoneda": 2,
        "Banco": "BBVA",
        "NumeroCTA": "156146146541658",
        "CCI": "000516516516-26561658146",
        "Moneda": "DÓLARES AMERICANOS"
      }
    ];
    crearDocPDF(DetallesVenta, Venta , cuentasBancarias);
  };

  return (
    <div className="App">
      <h1>Pdf Factura</h1>
      <p>
        <PdfFactura/>
      </p>
      <button onClick={handleGenerarPDF}>Generar  PDF</button>
      
    </div>
  );
}

export default App;




// App.js

// function App() {
//   return (
//     <div className="App">
//       <h1>Generar PDF Comprobantes</h1>
//       <PdfGuia/>
//       <p>

//       </p>
//       <PdfFactura/>
//       <p>

//       </p>
//       <PdfCotizacion />      
//     </div>
//   );
// }

// export default App;
