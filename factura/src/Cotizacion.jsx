import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'

const PdfCotizacion = () => {
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait', 
      unit: 'mm', 
      format: 'a4',
    });

    //x <->
    //y ^  
 
    // Informacion de la empresa 

    //funsiones de limite marguen
    const ylimitem = 128;
    const limiteyemp = doc.internal.pageSize.width - ylimitem ;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text('COCA-COLA SERVICIOS DE PERU S.A', 50, 10, { maxWidth: limiteyemp });    
    doc.setFontSize(8);
    doc.text('Direccion : AV. REPÚBLICA DE PANAMÁ URB. LIMATAMBO 4050', 50, 15,{ maxWidth: limiteyemp });    
    doc.text('Teléfonos: 854966666 | 6558842814', 50, 22,{ maxWidth: limiteyemp } );
    doc.text('Correo: Venta@mifacturaperu.com.', 50, 26,{ maxWidth: limiteyemp } );

    const Xlog = 7; 
    const Ylog = 6;  
    const rectWidthlog = 37;
    const rectHeightlog = 19; 
    doc.rect(Xlog, Ylog, rectWidthlog, rectHeightlog);

    doc.text('LOGO',22,16);
    
    // 2 Informacion del comprobannte 

    const limiteyco = 20; 
    const limiteycom = doc.internal.pageSize.width - limiteyco ;

    const X2 = 145; // Coordenada X de inicio del rectángulo
    const Y2 = 7;  // Coordenada Y de inicio del rectángulo
    const rectWidth2 = 60; // Ancho del rectángulo
    const rectHeight2 = 21; // Altura del rectángulo
    doc.roundedRect(X2, Y2, rectWidth2, rectHeight2, 3, 3);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text('R.U.C 20999999999', 157, 12,{ maxWidth: limiteycom });   
    doc.text('COTIZACION', 163, 19,{ maxWidth: limiteycom });
    doc.text('C -6000', 168, 25,{ maxWidth: limiteycom });

    //Linea de separacion
    const lineaIniX = 0; 
    const lineaFinX = 600; 
    const lineaY = 30;  
    doc.line(lineaIniX, lineaY, lineaFinX, lineaY);

    //  3Informacion del cliente
    const ylimite = 100;
    const limiteycli = doc.internal.pageSize.width - ylimite ;
    
    const X3 = 8; 
    const Y3 = 32;  
    const rectWidth3 = 130; 
    const rectHeight3 = 24; 
    doc.roundedRect(X3, Y3, rectWidth3, rectHeight3, 3, 3);

    
    doc.setFontSize(8);
    doc.text('RUC/DNI : 205366781652',10,37,{ maxWidth: limiteycli });
    doc.text('CLIENTE :  INVERCIONES MI FACTURA PERUONES MI FACTURA PERUONES MI FACTURA PERUONES MI FACTURA PERU',10,41,{ maxWidth: limiteycli });
    doc.text('DIRECCION :  Direccion Sucursal: AV. REPÚBLICA DEDireccion Sucursal: AV. REPÚBLICA DEDireccion Sucursal: AV. REPÚBLICA DE ',10,49,{ maxWidth: limiteycli });

    // Informacion de fechas y tipo de pago
    const ylifc = 20; 
    const limitey = doc.internal.pageSize.width - ylifc ;

    const X = 145; 
    const Y = 36;  
    const rectWidth = 60;
    const rectHeight = 20; 
    doc.roundedRect(X, Y, rectWidth, rectHeight, 3, 3);

    doc.setFontSize(10);
    doc.text('FECHA DE EMISION : 13-05-2024',X + 5,34,{ maxWidth: limitey });
    doc.setFontSize(8);
    doc.text('TIPO DE MONEDA :  SOL',X + 5,40,{ maxWidth: limitey });
    doc.text('CONDICION DE PAGO :  Credito',X + 5,44,{ maxWidth: limitey });
    doc.text('CANTIDAD DE DIAS : 30',X + 5,48,{ maxWidth: limitey });
    doc.text('PLAZO ENTREGA MAXIMO : 16-05-2024',X + 5,52,{ maxWidth: limitey });

    //Segunda linea de separacion 
    const lineaIniX2 = 0; 
    const lineaFinX2 = 600; 
    const linaY2 = 58;   
    doc.line(lineaIniX2, linaY2, lineaFinX2, linaY2); 

    // Tabla productos 

    const columnas = ['ITEM' , 'CODIGO' , 'DESCRIPCION' , 'CANTIDAD' , 'MEDIDA' , 'PRECIO' , 'DESCUENTO' , 'IMPORTE'];
    const data = [
      '1','P000041','TIJERA MULTIUSO ACERO UNIDAD','1','UNIDAD','28','0','28'
      
    ];

    doc.autoTable({
      startY: 60,
      head : [columnas],
      body : [data]
    })

    // Informacion de pie de pagina
    doc.setFontSize(6);
    doc.text('PARA CONSULTAR EL DOCUMENTO VISITA WWW.MIFACTURAPERU.COM   CERTIFICADO PSE POR SUNAT',10,295);
    doc.text('Representacion impresa del comprobante',160,295);

    //Recuadro Observaciones

    const XOb = 40; 
    const YOb = 270;  
    const rectWidthOb = 166;
    const rectHeightOb = 18;   
    doc.roundedRect(XOb, YOb, rectWidthOb, rectHeightOb, 3, 3);

    doc.setFontSize(10);
    doc.text('OBSERVACIONES:', 45,275);

    // Seccion de QR

    doc.setFontSize(6);
    doc.text('DATA',17,292);

    //reacuadro
    const Xqr = 10; 
    const Yqr = 270;  
    const rectWidthqr = 25;
    const rectHeightqr = 18; 
    doc.rect(Xqr, Yqr, rectWidthqr, rectHeightqr);

    doc.text('IMAGEN QR',17,280);

    // Tercera Linea de separacion 

    const lineainitX3 = 0; 
    const lineaFinX3 = 600; 
    const lineaY3 = 268;   
    doc.line(lineainitX3, lineaY3, lineaFinX3, lineaY3); 

    // Informacion nota 

    const xlimit=15;
    const limitWidthNo = doc.internal.pageSize.width - xlimit ;

    doc.setFontSize(8);
    doc.text('NOTA:',10,254);
    doc.text('1. Los precios incluyen IGV',10,257);
    doc.text('2. Deben ser aprobados todos los términos de la cotización sírvase enviar la orden de compra y correo electrónico de aceptación para proceder con la entrega de la mercadería y/o productos',10,260,{ maxWidth: limitWidthNo });
    doc.text('3. Los productos serán recogidos en nuestro punto de venta Jr. Jose Sabogal N 1200 - Cajamarca',10,266);

    //cuarta linea de separacion 

    const lineaIniX4 = 0; 
    const lineaFinX4 = 600; 
    const lineaY4 = 251;   
    doc.line(lineaIniX4, lineaY4, lineaFinX4, lineaY4);

    //Informacion de Precios

    doc.setFontSize(8);
    doc.text('SON: DOSCIENTOS TREINTA Y TRES CON 00/100SOLES',10,248);
    doc.setFontSize(10);
    doc.text('GRAVADO :   S/ 197.46',167,240);
    doc.text('IGV :  S/                35.54',167,244);
    doc.text('TOTAL : S/         233.00',167,248);

    
    
    doc.save('Diseño_Cotizacion.pdf');
  };

  return (
    <div>
      <button onClick={generatePDF}>Generar Cotizacion PDF</button>
    </div>
  );
};

export default PdfCotizacion;
