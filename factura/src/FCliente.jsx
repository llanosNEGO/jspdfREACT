// PdfGenerator.js

import React from 'react';
import { jsPDF } from 'jspdf';

const PdfGenerator = () => {
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait', // Orientación del documento (portrait/landscape)
      unit: 'mm', // Unidad de medida
      format: 'a4',
    });

    //x <->
    //y ^
    const ylimit = 128;
    const marginLeft = 20; 
    const ylimitcl = 100;
    const ylimitfc = 20;
       
    //const marginTop = 15;

    const contentWidth = doc.internal.pageSize.width - marginLeft ;
    const limitWidth = doc.internal.pageSize.width - ylimit ;
    const limitclWidth = doc.internal.pageSize.width - ylimitcl ;
    const limitfc = doc.internal.pageSize.width - ylimitfc ;
    //const contentHeight = doc.internal.pageSize.height - marginTop * 2; 
    // Informacion de la empresa 
    doc.setFontSize(12);
    doc.text('COCA-COLA SERVICIOS DE PERU S.A', 50, 15, { maxWidth: limitWidth });    
    doc.setFontSize(8);
    doc.text('Direccion Sucursal: AV. REPÚBLICA DE PANAMÁ URB. LIMATAMBO 4050', 50, 20,{ maxWidth: limitWidth });    
    doc.text('Teléfonos: 854966666 | 6558842814', 50, 27,{ maxWidth: limitWidth } );
    doc.text('CORREO: Venta@mifacturaperu.com.', 50, 32,{ maxWidth: limitWidth } );
    
    // Informacion del comprobannte 
    doc.setFontSize(12);
    doc.text('R.U.C 20999999999', 150, 15,{ maxWidth: contentWidth });   
    doc.text('COTIZACION', 155, 22,{ maxWidth: contentWidth });
    doc.text('C -6000', 160, 29,{ maxWidth: contentWidth });

    // Informacion del cliente 
    doc.setFontSize(8);
    doc.text('RUC/DNI : 205366781652',10,43,{ maxWidth: limitclWidth });
    doc.text('CLIENTE :  INVERCIONES MI FACTURA PERUONES MI FACTURA PERUONES MI FACTURA PERUONES MI FACTURA PERU',10,47,{ maxWidth: limitclWidth });
    doc.text('DIRECCION :  Direccion Sucursal: AV. REPÚBLICA DEDireccion Sucursal: AV. REPÚBLICA DEDireccion Sucursal: AV. REPÚBLICA DE ',10,55,{ maxWidth: limitclWidth });

    // Informacion de fechas y tipo de pago
    doc.setFontSize(8);
    doc.text('FECHA DE EMISION : 13-05-2024',150,40,{ maxWidth: limitfc });
    doc.text('TIPO DE MONEDA :  SOL',150,46,{ maxWidth: limitfc });
    doc.text('CONDICION DE PAGO :  Credito',150,50,{ maxWidth: limitfc });
    doc.text('CANTIDAD DE DIAS : 30',150,54,{ maxWidth: limitfc });
    doc.text('PLAZO ENTREGA MAXIMO : 16-05-2024',150,58,{ maxWidth: limitfc });

    // Guardar el PDF
    doc.save('Diseño_Cotizacion.pdf');
  };

  return (
    <div>
      <button onClick={generatePDF}>Generar PDF con Dos Bloques</button>
    </div>
  );
};

export default PdfGenerator;
