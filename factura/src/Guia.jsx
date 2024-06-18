import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'


const PdfGuia = () => {
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
        doc.text('GUIA REMISION REMITENTE', 154, 19,{ maxWidth: limiteycom });
        doc.text('TO02  -  00015', 164, 25,{ maxWidth: limiteycom });

        //Informacion datos del traslado y fecha
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text('DATOS DEL TRASLADO',8,33);
        doc.setFont("helvetica", "normal");

        doc.setFont("helvetica", "bold");
        doc.text('FECHA DE EMISION : 13-05-2024', 146,33);
        doc.setFont("helvetica", "normal");

        //informacion del comprobante
        const ylimite = 100;
        const limiteycli = doc.internal.pageSize.width - ylimite ;
        
        const XO = 8; 
        const YO = 35;  
        const rectWidthO = 197;
        const rectHeightO = 18;   
        doc.roundedRect(XO, YO, rectWidthO, rectHeightO, 3, 3);
        
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text('MOTIVO DE TRASLADO :', 10, 39);
        doc.setFont("helvetica", "normal");
        doc.text('VENTA', 43, 39, { maxWidth: limiteycli });
        doc.setFont("helvetica", "bold");
        doc.text('FECHA INICIO TRASLADO :', 10, 44);
        doc.setFont("helvetica", "normal");
        doc.text('13-05-2024 16:58', 48, 44, { maxWidth: limiteycli });
        doc.setFont("helvetica", "bold");
        doc.text('DOC.RELACIONADO :', 10, 49);
        doc.setFont("helvetica", "normal");
        doc.text('FACTRURA-FE01-0000085', 42, 49, { maxWidth: limiteycli });

        //Informacion de transporte
        const ylifc = 20; 
        const limitey = doc.internal.pageSize.width - ylifc ;

        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text('MODALIDAD DE TRANSPORTE :',120,39);
        doc.setFont("helvetica", "normal");
        doc.text('TRANSPORTE PRIVADO',169,39,{ maxWidth: limitey });
        doc.setFont("helvetica", "bold");
        doc.text('PESO BRUTO :',120,44);
        doc.setFont("helvetica", "normal");
        doc.text('0.15 KILOS',144,44,{ maxWidth: limitey });
        doc.setFont("helvetica", "bold");
        doc.text('CANTIDAD DE BULTOS :',120,49);
        doc.setFont("helvetica", "normal");
        doc.text(' 1',154,49,{ maxWidth: limitey });   
        
        //Informacion sobre punto de partida 
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text('PUNTO DE PARTIDA',8,58);
        doc.setFont("helvetica", "normal");

        const limity = 119;
        const limiteypl = doc.internal.pageSize.width - limity ;

        const Xpl = 8; 
        const Ypl = 60;  
        const rectWidthpl = 94;
        const rectHeightpl = 15;   
        doc.roundedRect(Xpl, Ypl, rectWidthpl, rectHeightpl, 3, 3);
        doc.setFontSize(8);
        doc.text('AV.REPUBLICA LOTE 57 URB. LOS CAMELIOS  LTZ LOS AMENDRON -5784 SANTA ROSA - LIMA - LIMA',10,65,{maxWidth : limiteypl});



        //Informacion sobre punto de llegada 
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text('PUNTO DE LLEGADA', 108,58);
        doc.setFont("helvetica", "normal");

        const limitypp = 115;
        const limiteypp = doc.internal.pageSize.width - limitypp ;
    
        const Xpp = 105; 
        const Ypp = 60;  
        const rectWidthpp = 100;
        const rectHeightpp = 15;   
        doc.roundedRect(Xpp, Ypp, rectWidthpp, rectHeightpp, 3, 3);     
        doc.setFontSize(8);
        doc.text('AV.REPUBLICA LOTE 57 URB. LOS CAMELIOS  LTZ LOS AMENDRON -5784 TRUJILLO - TRUJILLO - TRUJILO',108,65,{maxWidth : limiteypp});

        //Datos del destinatario
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text('DATOS DEL DESTINATARIO', 8,80);
        doc.setFont("helvetica", "normal");

        const Xd = 8; 
        const Yd = 82;  
        const rectWidthd = 94;
        const rectHeightd = 15;   
        doc.roundedRect(Xd, Yd, rectWidthd, rectHeightd, 3, 3);

        const limitde = 119;
        const limiteyde = doc.internal.pageSize.width - limitde ;
        doc.setFontSize(8);
        doc.text('COMPAÑIA MINERA ANTAMINA S.A ',10,88,{maxWidth:limiteyde});
        doc.text('RUC: 20330262428',10,94,{maxWidth:limiteyde});


        //Datos de los vehiculos
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text('DATOS DE LOS VEHICULOS', 108,80);
        doc.setFont("helvetica", "normal");

        const limitdv = 119;
        const limiteydv = doc.internal.pageSize.width - limitdv ;

        const Xdv = 105; 
        const Ydv = 82;  
        const rectWidthdv = 100;
        const rectHeightdv = 15;   
        doc.roundedRect(Xdv, Ydv, rectWidthdv, rectHeightdv, 3, 3);
        doc.setFontSize(8);
        doc.text('PRINCIPAL:   volvo 523',108,88,{maxWidth:limiteydv});
        doc.text('SECUNDARIO 1:   trailer',108,94,{maxWidth:limiteydv})

        const limitdv2 = 50;
        const limiteydv2 = doc.internal.pageSize.width - limitdv2 ;
        doc.setFontSize(8);
        doc.text('NUMERO PLACA: BFO781',166,88,{maxWidth:limiteydv2});
        doc.text('NUMERO PLACA: ATF980',166,94,{maxWidth:limiteydv2});

        //Datos de los conductores 

        doc.setFontSize(10);
        doc.setFont("helvetica","bold");
        doc.text('DATOS DE LOS CONDUCTORES',10,102);
        doc.setFont("helvetica","normal");

        const Xdc = 8; 
        const Ydc = 104;  
        const rectWidthdc = 94;
        const rectHeightdc = 20;   
        doc.roundedRect(Xdc, Ydc, rectWidthdc, rectHeightdc, 3, 3);

        const limitdc = 119;
        const limiteydc = doc.internal.pageSize.width - limitdc ;

        doc.setFontSize(8);
        doc.text('PRINCIPAL: TERRO NES ALBERTO JULIAN SUARES',10,108,{maxWidth:limiteydc});
        doc.text('DNI-45689524',10,112,{maxWidth:limiteydc});
        doc.text('LICENCIA : Q-45689524',60,112,{maxWidth:limiteydc});
        doc.text('SECUNDARIO:  TERRO NES ALBERTO JULIAN SUARES',10,117,{maxWidth:limiteydc});
        doc.text('DNI-45689524',10,120,{maxWidth:limiteydc});
        doc.text('LICENCIA : Q-45689524',60,120,{maxWidth:limiteydc});

        //EMPRESA TRANSPORTISTA

        doc.setFontSize(10);
        doc.setFont("helvetica","bold");
        doc.text('EMPRESA TRANSPORTISTA',108,102);
        doc.setFont("helvetica","normal");

        const Xet = 105; 
        const Yet = 104;  
        const rectWidthet = 100;
        const rectHeightet = 20;   
        doc.roundedRect(Xet, Yet, rectWidthet, rectHeightet, 3, 3); 
        
        doc.setFontSize(8);
        doc.text('NOMBRE :',109,112);
        doc.text('RUC :',109,120);

        //DATOS DE PRODUCTOS LIST

        doc.setFontSize(10);
        doc.setFont("helvetica","bold");
        doc.text('DATOS PRODUCTOS',8,128);
        doc.setFont("helvetica","normal");

        // Informacion de pie de pagina
        doc.setFontSize(6);
        doc.text('PARA CONSULTAR EL DOCUMENTO VISITA WWW.MIFACTURAPERU.COM   CERTIFICADO PSE POR SUNAT',10,295);
        doc.text('Representacion impresa del comprobante',160,295);

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

        
        //Recuadro Observaciones

        const XOb = 103; 
        const YOb = 265;  
        const rectWidthOb = 55;
        const rectHeightOb = 25;   
        doc.roundedRect(XOb, YOb, rectWidthOb, rectHeightOb, 3, 3);

        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text('OBSERVACIONES:', 105,270);
        doc.setFont("helvetica", "normal");

        //Recuadro Recibi conforme

        const Xrc = 160; 
        const Yrc = 265;  
        const rectWidthrc = 47;
        const rectHeightrc = 25;   
        doc.roundedRect(Xrc, Yrc, rectWidthrc, rectHeightrc, 3, 3);

        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text('RECIBI CONFORME :', 163,270);
        doc.setFont("helvetica", "normal");

        doc.setFont("helvetica", "bold");
        const lineaxrc = 166; 
        const linexrc = 203; 
        const lineayrc = 284;   
        doc.line(lineaxrc, lineayrc, linexrc, lineayrc);
        doc.setFont("helvetica", "normal");

        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text('FIRMA, SELLO Y FECHA',168,288);
        doc.setFont("helvetica", "normal");

        //Linea separacion 
        const lineaIniX2 = 0; 
        const lineaFinX2 = 600; 
        const linaY2 = 263;   
        doc.line(lineaIniX2, linaY2, lineaFinX2, linaY2); 



 




        
        

        doc.save('Diseño_Guia.pdf');


    }
    return (
        <div>
             <button onClick={generarPDF}>Generar Guia PDF</button>
        </div>
 
     );
}
export default PdfGuia

   