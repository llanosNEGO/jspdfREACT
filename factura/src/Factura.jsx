import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'

const PdfFactura = () => {
    const generarPDF = () =>{
        const doc = new jsPDF({
            orientation: 'portrait', 
            unit: 'mm', 
            format: 'a4',
        });
        
        // Informacion de la empresa 

        //funsiones de limite marguen
        const ylimitem = 128;
        const limiteyemp = doc.internal.pageSize.width - ylimitem ;

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold")
        doc.text('COCA-COLA SERVICIOS DE PERU S.A', 50, 10, { maxWidth: limiteyemp }); 
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal")
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

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text('R.U.C 20999999999', 153, 14,{ maxWidth: limiteycom });   
        doc.setFontSize(10);
        doc.text('FACTURA ELECTRONICA', 154, 19,{ maxWidth: limiteycom });
        doc.text('FE02  -  00015', 164, 25,{ maxWidth: limiteycom });

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
        doc.setFont("helvetica", "bold");
        doc.text('RUC/DNI :', 10, 37);
        doc.setFont("helvetica", "normal");
        doc.text('205366781652', 26, 37, { maxWidth: limiteycli });
        doc.setFont("helvetica", "bold");
        doc.text('CLIENTE :', 10, 41);
        doc.setFont("helvetica", "normal");
        doc.text('INVERCIONES MI FACTURA PERUONES MI FACTURA PERUONES MI FACTURA PERUONES MI FACTURA PERU', 26, 41, { maxWidth: limiteycli });
        doc.setFont("helvetica", "bold");
        doc.text('DIRECCION :', 10, 49);
        doc.setFont("helvetica", "normal");
        doc.text('Direccion Sucursal: AV. REPÚBLICA DEDireccion Sucursal: AV. REPÚBLICA DEDireccion Sucursal: AV. REPÚBLICA DE ', 30, 49, { maxWidth: limiteycli });

        // Informacion de fechas y tipo de pago
        const ylifc = 20; 
        const limitey = doc.internal.pageSize.width - ylifc ;

        const X = 145; 
        const Y = 36;  
        const rectWidth = 60;
        const rectHeight = 20; 
        doc.roundedRect(X, Y, rectWidth, rectHeight, 3, 3);

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text('FECHA DE EMISION : 13-05-2024', 146,34,{ maxWidth: limitey });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text('TIPO DE MONEDA :',X + 5,40);
        doc.setFont("helvetica", "normal");
        doc.text('  SOL',176,40,{ maxWidth: limitey });
        doc.setFont("helvetica", "bold");
        doc.text('CONDICION DE PAGO :',X + 5,44);
        doc.setFont("helvetica", "normal");
        doc.text('Credito',183,44,{ maxWidth: limitey });
        doc.setFont("helvetica", "bold");
        doc.text('CANTIDAD DE DIAS :',X + 5,48);
        doc.setFont("helvetica", "normal");
        doc.text(' 30',180,48,{ maxWidth: limitey });
        doc.setFont("helvetica", "bold");
        doc.text('CATIDAD DE CUOTAS:',X + 5,52)
        doc.setFont("helvetica", "normal");
        doc.text('  2',183,52,{ maxWidth: limitey });

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

        //Recuadro Numeros de cuenta 
        const limiYa = 100;
        const limitenumc = doc.internal.pageSize.width - limiYa ;

        const XOb = 103; 
        const YOb = 270;  
        const rectWidthOb = 102;
        const rectHeightOb = 20;   
        doc.roundedRect(XOb, YOb, rectWidthOb, rectHeightOb, 3, 3);

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text('NUMEROS DE CUENTA:', 108,275);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(6);
        doc.text('BCP SOLES NRO.CTA: 256161616514984 CCI: 00006584964964064',108,279,{ maxWidth: limitenumc });
        doc.text('BCP DÓLARES NRO.CTA: 5146146846274514 CCI: 0000064869849849849849',108,282,{ maxWidth: limitenumc });
        doc.text('BBVA SOLES NRO.CTA: 256161616514984 CCI: 00006584964964064 ',108,285,{ maxWidth: limitenumc });
        doc.text('BBVA DÓLARES  NRO.CTA: 5146146846274514 CCI: 000064869849849849849',108,288,{ maxWidth: limitenumc });

        // Seccion de QR DATA

        doc.setFontSize(6);
        doc.text('DATA',17,292);

        const Xqr = 10; 
        const Yqr = 270;  
        const rectWidthqr = 25;
        const rectHeightqr = 18; 
        doc.rect(Xqr, Yqr, rectWidthqr, rectHeightqr);

        doc.text('IMAGEN QR',17,280);

        // Seccion de QR XML

        doc.setFontSize(6);
        doc.text('XML',52,292);

        const Xxml = 42; 
        const Yxml = 270;  
        const rectWidthxml = 25;
        const rectHeightxml = 18; 
        doc.rect(Xxml, Yxml, rectWidthxml, rectHeightxml);

        doc.text('IMAGEN QR',48,280);


        // Seccion de QR CDR

        doc.setFontSize(6);
        doc.text('CDR',84,292);

        const Xcd = 74; 
        const Ycd = 270;  
        const rectWidthcd = 25;
        const rectHeightcd = 18; 
        doc.rect(Xcd, Ycd, rectWidthcd, rectHeightcd);

        doc.text('IMAGEN QR',80,280);

        // Tercera Linea de separacion 

        const lineainitX3 = 0; 
        const lineaFinX3 = 600; 
        const lineaY3 = 268;   
        doc.line(lineainitX3, lineaY3, lineaFinX3, lineaY3);
        
        //Recuadro Observaciones

        const XO = 8; 
        const YO = 248;  
        const rectWidthO = 197;
        const rectHeightO = 18;   
        doc.roundedRect(XO, YO, rectWidthO, rectHeightO, 3, 3);

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text('OBSERVACIONES:', 10,253);
        doc.setFont("helvetica", "normal");

        //Informacion de Precios

        doc.setFontSize(8);
        doc.text('SON: DOSCIENTOS TREINTA Y TRES CON 00/100SOLES',10,246);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text('GRAVADO :   S/ 197.46',167,238);
        doc.text('IGV :  S/                35.54',167,242);
        doc.text('TOTAL : S/         233.00',167,246); 
        doc.setFont("helvetica", "normal");

        doc.save('Diseño_Factura.pdf');
      };
    
    return (
       <div>
            <button onClick={generarPDF}>Generar Factura PDF</button>
       </div>

    );
};
export default PdfFactura
