
import React from 'react';
import PdfCotizacion from './Cotizacion';
import PdfFactura from './Factura';
//import PdfGuia from './Guia';
import './App.css';
import  crearDocPDF  from './NFactura.jsx'
import crearCotPDF from './NCotizacion.jsx'


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
        "OrdenCompra": "OC-2024-00004",
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
  const handleGeneraPDF = () => {
    const DetallesVenta =
    [
      {
          "id":295,
          "idCotizacion":75,
          "cantidad":1,
          "entregado":0,
          "IdProducto":37,
          "NombreProducto":"OLLA ALUMINIO ANTIADHERENTE   UNIDAD ",
          "idPresentacion":38,
          "IdPresentacion":38,
          "NombrePresentacion":"PRINCIPAL",
          "EsFacturable":1,
          "idStock":1119,
          "Stock":959,
          "IdTipoStock":1,
          "idAfectacionIgv":1,
          "precioVenta":75,
          "valorUnitario":63.559322,
          "Descuento":0,
          "total":75,
          "idAlmacen":3,
          "tipoCambio":1,
          "IdGrupoClasificacionIgv":1,
          "initialAfectGrat":1,
          "NombreProductoConPresentacion":"OLLA ALUMINIO ANTIADHERENTE   UNIDAD","Tributos":"[1]",
          "TasaIsc":null,
          "descripcion":"OLLA ALUMINIO ANTIADHERENTE  PRINCIPAL",
          "unidadMedida":"UNIDAD",
          "Codigo":"P0000037",
          "NombreProductoUnidadPrecio":"OLLA ALUMINIO ANTIADHERENTE   UNIDAD  X S/ 75.00","IdAlmacen":3,
          "precios":
          [
              {
                  "IdPrecioPlantilla":1,
                  "NombrePrecio":"Costo",
                  "Precio":68.99999968,
                  "CantidadPrecio":0,
                  "ValorUnitario":58.474576,
                  "IdPrecio":112,
                  "Porcentaje":null,
                  "afectacionFree":"0",
                  "normalPrice":58.474576
              },
              {
                  "IdPrecioPlantilla":2,
                  "NombrePrecio":"Menor/Lista",
                  "Precio":74.99999996,
                  "CantidadPrecio":0,
                  "ValorUnitario":63.559322,
                  "IdPrecio":113,
                  "Porcentaje":0.09,
                  "afectacionFree":"0",
                  "normalPrice":63.559322
              },
              {
                  "IdPrecioPlantilla":3,
                  "NombrePrecio":"Mayor",
                  "Precio":0,
                  "CantidadPrecio":0,
                  "ValorUnitario":0,
                  "IdPrecio":114,
                  "Porcentaje":null,
                  "afectacionFree":"0",
                  "normalPrice":0
              }    
          ],
          "PrecioVenta":75,
          "PrecioEspecial":0,
          "PrecioFamiliar":0,
          "PrecioCosto":68.99999968,
          "PrecioMenor":74.99999996,
          "oldPrecios":[],
          "precioMayor":0,
          "Cantidad":1,
          "Total":75,
          "Importe":75,
          "Unidad":"UNIDAD",
          "Indice":1
      },
      {
          "id":296,
          "idCotizacion":75,
          "cantidad":1,
          "entregado":0,
          "IdProducto":35,
          "NombreProducto":"SET X 4 RECIPIENTES DE VIDRIO  UNIDAD ","idPresentacion":36,
          "IdPresentacion":36,
          "NombrePresentacion":"PRINCIPAL",
          "EsFacturable":1,
          "idStock":1057,
          "Stock":61,
          "IdTipoStock":1,
          "idAfectacionIgv":1,
          "precioVenta":87.000001,
          "valorUnitario":73.728814,
          "Descuento":0,
          "total":87.000001,
          "idAlmacen":3,
          "tipoCambio":1,
          "IdGrupoClasificacionIgv":1,
          "initialAfectGrat":1,
          "NombreProductoConPresentacion":"SET X 4 RECIPIENTES DE VIDRIO UNIDAD",
          "Tributos":"[1]",
          "TasaIsc":null,
          "descripcion":"SET X 4 RECIPIENTES DE VIDRIO PRINCIPAL","unidadMedida":"UNIDAD",
          "Codigo":"P0000035",
          "NombreProductoUnidadPrecio":"SET X 4 RECIPIENTES DE VIDRIO  UNIDAD  X S/ 87.00",
          "IdAlmacen":3,
          "precios":
          [
              {
                  "IdPrecioPlantilla":1,
                  "NombrePrecio":"Costo",
                  "Precio":73.99999952,
                  "CantidadPrecio":0,
                  "ValorUnitario":62.711864,
                  "IdPrecio":106,
                  "Porcentaje":null,
                  "afectacionFree":"0",
                  "normalPrice":62.711864
              },
              {
                  "IdPrecioPlantilla":2,
                  "NombrePrecio":"Menor/Lista",
                  "Precio":87.00000052,
                  "CantidadPrecio":0,
                  "ValorUnitario":73.728814,
                  "IdPrecio":107,
                  "Porcentaje":0.18,
                  "afectacionFree":"0",
                  "normalPrice":73.728814
              },
              {
                  "IdPrecioPlantilla":3,
                  "NombrePrecio":"Mayor",
                  "Precio":0,"CantidadPrecio":0,
                  "ValorUnitario":0,
                  "IdPrecio":108,
                  "Porcentaje":null,
                  "afectacionFree":"0",
                  "normalPrice":0
              }
          ],
          "PrecioVenta":87.000001,
          "PrecioEspecial":0,
          "PrecioFamiliar":0,
          "PrecioCosto":73.99999952,
          "PrecioMenor":87.00000052,
          "oldPrecios":[],
          "precioMayor":0,
          "Cantidad":1,
          "Total":87.000001,
          "Importe":87.000001,
          "Unidad":"UNIDAD",
          "Indice":2
      },
      {
          "id":297,
          "idCotizacion":75,
          "cantidad":1,
          "entregado":0,
          "IdProducto":27,
          "NombreProducto":"BANDEJA PARA DESAYUNO  UNIDAD ",
          "idPresentacion":28,"IdPresentacion":28,"NombrePresentacion":"PRINCIPAL",
          "EsFacturable":1,
          "idStock":809,
          "Stock":978,
          "IdTipoStock":1,
          "idAfectacionIgv":1,
          "precioVenta":15,
          "valorUnitario":12.711864,
          "Descuento":0,
          "total":15,
          "idAlmacen":3,
          "tipoCambio":1,
          "IdGrupoClasificacionIgv":1,
          "initialAfectGrat":1,
          "NombreProductoConPresentacion":"BANDEJA PARA DESAYUNO  UNIDAD","Tributos":"[1]",
          "TasaIsc":null,
          "descripcion":"BANDEJA PARA DESAYUNO PRINCIPAL","unidadMedida":"UNIDAD",
          "Codigo":"P0000027",
          "NombreProductoUnidadPrecio":"BANDEJA PARA DESAYUNO  UNIDAD  X S/ 15.00","IdAlmacen":3,
          "precios":
          [
              {
                  "IdPrecioPlantilla":1,
                  "NombrePrecio":"Costo",
                  "Precio":9.99999968,
                  "CantidadPrecio":0,
                  "ValorUnitario":8.474576,
                  "IdPrecio":82,
                  "Porcentaje":null,
                  "afectacionFree":"0",
                  "normalPrice":8.474576
              },
              {
                  "IdPrecioPlantilla":2,
                  "NombrePrecio":"Menor/Lista",
                  "Precio":14.99999952,
                  "CantidadPrecio":0,
                  "ValorUnitario":12.711864,
                  "IdPrecio":83,
                  "Porcentaje":0.5,
                  "afectacionFree":"0",
                  "normalPrice":12.711864
              },
              {
                  "IdPrecioPlantilla":3,
                  "NombrePrecio":"Mayor",
                  "Precio":0,
                  "CantidadPrecio":0,
                  "ValorUnitario":0,
                  "IdPrecio":84,
                  "Porcentaje":null,
                  "afectacionFree":"0",
                  "normalPrice":0
              }
          ],
          "PrecioVenta":15,
          "PrecioEspecial":0,
          "PrecioFamiliar":0,
          "PrecioCosto":9.99999968,
          "PrecioMenor":14.99999952,
          "oldPrecios":[],
          "precioMayor":0,
          "Cantidad":1,
          "Total":15,
          "Importe":15,
          "Unidad":"UNIDAD",
          "Indice":3
      }
    ];
    const Venta = 
    {
        "id":75,
        "fechaEmision":"2024-05-16 23:54:00",
        "total":177,
        "descripcion":"",
        "estado":"APROBADO",
        "razonSocial":"ESCOBEDO MEDINA AUDITORES ASOCIADOS S.CIVIL DE R.L.",
        "Abreviatura":"SOL",
        "Simbolo":"S/",
        "IdTipoDocumento":6,
        "NroTipoDocumento":"20546121250",
        "Direccion":"AV. SANTO TORIBIO - 143",
        "CorreoElectronico":"",
        "serie":"C",
        "serieNum":"C-75",
        "Letras":"CIENTO SETENTA Y SIETE CON 00/100 SOLES",
        "Sucursal":"LIMA",
        "DireccionSucursal":"AV. REPÚBLICA DE PANAMÁ URB. LIMATAMBO 4050","Empresa":"COCA-COLA SERVICIOS DE PERU S.A",
        "Ruc":"20415932376",
        "Logo":null,
        "IdModalidadPago":"CONTADO",
        "PlazoEntrega":"2024-05-17",
        "CodigoTipoComprobante":"-8",
        "IdTipoDocumentoSunat":"-8",
        "NombreEmpleado":"NEGO",
        "ApellidoEmpleado":"LIMA",
        "Ubigeo":"150131",
        "Celular":"",
        "DireccionCliente":"AV. SANTO TORIBIO - 143","TipoComprobante":"Cotización",
        "TelefonoDos":"854966666",
        "TelefonoTres":"6558842814",
        "NombreCaja":"",
        "FechaEmision":"2024-05-16 23:54:00",
        "RazonSocial":"ESCOBEDO MEDINA AUDITORES ASOCIADOS S.CIVIL DE R.L.",
        "Descripcion":"Cotización",
        "Observacion":"",
        "Serie":"C",
        "NumeroComprobante":75,
        "Redondeo":0,
        "Gravadas":150.00000084745798,
        "Exoneradas":0,
        "Inafectas":0,
        "ICBPER":0,
        "IGV":27,
        "Exportacion":0,
        "Total":177.000001,
        "Gratuitas":0,
        "ISC":0,
        "IVAP":0,
        "DescuentoTotal":0,
        "TotalRedondeo":177.000001,
        "Correo": "Venta@mifacturaperu.com",
        "Consultadocumento":"PARA CONSULTAR EL DOCUMENTO VISITA WWW.MIFACTURAPERU COM   CERTIFICADO PSE POR SUNAT",
        "Representacion":"Representacion impresa del comprobante",
        "nota":"NOTA: ",
        "nota1":"1. Los precios incluyen IGV",
        "nota2":"2. Deben ser aprobados todos los términos de la cotización sírvase enviar la orden de compra y correo electrónico de aceptación para proceder con la entrega de la mercadería y/o productos",
        "nota3":"3. Los productos serán recogidos en nuestro punto de venta Jr. Jose Sabogal N 1200 - Cajamarca",
        "DireccionCliente": "CAL. ARGENTINA URB. EL RECREO ET. 2 131",
        "infoCotizaciones":
        ["Esta cotización es válida hasta agotar stock.","Los precios pueden cambiar sin previo aviso."],        
        "EsCotizacion":true
    };
    const cuentasBancarias =
    [
        {
            "IdNumerosCuenta":1,
            "IdEmpresa":2,
            "IdMoneda":1,
            "Banco":"BCP",
            "NumeroCTA":"256161616514984",
            "CCI":"00006584964964064",
            "Moneda":"SOLES"
        },
        {
            "IdNumerosCuenta":2,
            "IdEmpresa":2,
            "IdMoneda":2,
            "Banco":"BCP",
            "NumeroCTA":"5146146846274514",
            "CCI":"0000064869849849849849",
            "Moneda":"DÓLARES AMERICANOS"
        },
        {
            "IdNumerosCuenta":3,
            "IdEmpresa":2,
            "IdMoneda":1,
            "Banco":"BBVA",
            "NumeroCTA":"468464641646584646",
            "CCI":"5146146135164114",
            "Moneda":"SOLES"
        },
        {
            "IdNumerosCuenta":4,
            "IdEmpresa":2,
            "IdMoneda":2,
            "Banco":"BBVA",
            "NumeroCTA":"156146146541658",
            "CCI":"000516516516-26561658146",
            "Moneda":"DÓLARES AMERICANOS"
        }
    ];
    crearCotPDF(DetallesVenta,Venta,cuentasBancarias);
  };

  return (
    <div className="App">
      <h1>Pdf Factura</h1>
      <p>
        <PdfFactura/>
      </p>
      <p>
        <PdfCotizacion />
      </p>
      <button onClick={handleGenerarPDF}>Generar Nueva Factura PDF</button>
      <p></p>
      <button onClick={handleGeneraPDF}>Generar Nueva Cotizacion PDF</button>
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
