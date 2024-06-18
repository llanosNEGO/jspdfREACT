import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'

const PdfGenerator = () => {
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait', 
      unit: 'mm', 
      format: 'a4',
    });

    //x <->
    //y ^
    const ylimit = 128;
    const marginLeft = 20; 
    const ylimitcl = 100;
    const ylimitfc = 20;      
 
    const contentWidth = doc.internal.pageSize.width - marginLeft ;
    const limitWidth = doc.internal.pageSize.width - ylimit ;
    const limitclWidth = doc.internal.pageSize.width - ylimitcl ;
    const limitfc = doc.internal.pageSize.width - ylimitfc ;

    // Informacion de la empresa 
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text('COCA-COLA SERVICIOS DE PERU S.A', 50, 15, { maxWidth: limitWidth });    
    doc.setFontSize(8);
    doc.text('Direccion Sucursal: AV. REPÚBLICA DE PANAMÁ URB. LIMATAMBO 4050', 50, 20,{ maxWidth: limitWidth });    
    doc.text('Teléfonos: 854966666 | 6558842814', 50, 27,{ maxWidth: limitWidth } );
    doc.text('CORREO: Venta@mifacturaperu.com.', 50, 32,{ maxWidth: limitWidth } );
    
    // 2 Informacion del comprobannte 

    const startX2 = 145; // Coordenada X de inicio del rectángulo
    const startY2 = 10;  // Coordenada Y de inicio del rectángulo
    const rectWidth2 = 60; // Ancho del rectángulo
    const rectHeight2 = 21; // Altura del rectángulo

    doc.rect(startX2, startY2, rectWidth2, rectHeight2);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text('R.U.C 20999999999', 157, 15,{ maxWidth: contentWidth });   
    doc.text('COTIZACION', 163, 22,{ maxWidth: contentWidth });
    doc.text('C -6000', 168, 29,{ maxWidth: contentWidth });

    const lineStartX = 0; 
    const lineEndX = 600; 
    const lineY = 35;
  
    doc.line(lineStartX, lineY, lineEndX, lineY); 

    const startX3 = 8; 
    const startY3 = 38;  
    const rectWidth3 = 130; 
    const rectHeight3 = 24; 

    doc.rect(startX3, startY3, rectWidth3, rectHeight3);

    //  3Informacion del cliente 
    doc.setFontSize(8);
    doc.text('RUC/DNI : 205366781652',10,43,{ maxWidth: limitclWidth });
    doc.text('CLIENTE :  INVERCIONES MI FACTURA PERUONES MI FACTURA PERUONES MI FACTURA PERUONES MI FACTURA PERU',10,47,{ maxWidth: limitclWidth });
    doc.text('DIRECCION :  Direccion Sucursal: AV. REPÚBLICA DEDireccion Sucursal: AV. REPÚBLICA DEDireccion Sucursal: AV. REPÚBLICA DE ',10,55,{ maxWidth: limitclWidth });

    const startX = 145; 
    const startY = 42;  
    const rectWidth = 60;
    const rectHeight = 20; 
    

    doc.rect(startX, startY, rectWidth, rectHeight);

    // Informacion de fechas y tipo de pago
    doc.setFontSize(8);
    doc.text('FECHA DE EMISION : 13-05-2024',startX + 5,40,{ maxWidth: limitfc });
    doc.text('TIPO DE MONEDA :  SOL',startX + 5,46,{ maxWidth: limitfc });
    doc.text('CONDICION DE PAGO :  Credito',startX + 5,50,{ maxWidth: limitfc });
    doc.text('CANTIDAD DE DIAS : 30',startX + 5,54,{ maxWidth: limitfc });
    doc.text('PLAZO ENTREGA MAXIMO : 16-05-2024',startX + 5,58,{ maxWidth: limitfc });

    const lineStartX2 = 0; 
    const lineEndX2 = 600; 
    const lineY2 = 64; 
  
    doc.line(lineStartX2, lineY2, lineEndX2, lineY2); 

    // Tabla productos 

    const columnas = ['ITEM' , 'CODIGO' , 'DESCRIPCION' , 'CANTIDAD' , 'MEDIDA' , 'PRECIO' , 'DESCUENTO' , 'IMPORTE'];
    const data = [
      '1','P000041','TIJERA MULTIUSO ACERO UNIDAD','1','UNIDAD','28','0','28'
      
    ];

    doc.autoTable({
      startY: 66,
      head : [columnas],
      body : [data]
    })
    
    doc.save('Diseño_Cotizacion.pdf');
  };

  return (
    <div>
      <button onClick={generatePDF}>Generar PDF</button>
    </div>
  );
};

export default PdfGenerator;
