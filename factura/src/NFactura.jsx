import { jsPDF } from 'jspdf';
import { Style, Section } from "./ClasesImpresion";
import 'jspdf-autotable';
import {decimalAdjust, doDownload, VALE} from "./Global";
// import { decimalAdjust, calculateVueltoToDisplay } from './../Global';
// import moment from "moment";

function crearDocPDF(DetallesVenta, Venta, cuentasBancarias = []) {
    // Configuración y ajustes previos...

    const extraConf = JSON.parse(window.localStorage.getItem('extraConf'));
    const showExtraInfo = extraConf ? extraConf.showExtraInfo : false;
    const showTwoDecimals = extraConf ? extraConf.showTwoDecimals : false;
    const hasRetencion = Number(Venta.retencion) > 0;

    const DetalleVentaFormateado = DetallesVenta.map((producto) => {
        return {
            ...producto,
            Cantidad: showTwoDecimals ? Number(decimalAdjust('floor', producto.Cantidad, -2)) : producto.Cantidad,
            PrecioVenta: showTwoDecimals ? Number(decimalAdjust('floor', producto.PrecioVenta, -2)) : producto.PrecioVenta,
            
            Descuento: producto.Descuento
        }
    });

    Venta.descItems = DetalleVentaFormateado.map(d => d.Descuento).reduce((a, b) => a + b, 0);

    let doc = new jsPDF({});
    
    //TITULO EMPRESA
    const EmpresaTittleStyle = new Style(12, "bold ",1.5);
    const EmpresaTittleSection = new Section(
        doc,
        44, //x
        8, //y
        EmpresaTittleStyle,
        100//limit
    );
    doc.setFont("helvetica", "bold");    
    EmpresaTittleSection.write(Venta.Empresa.toUpperCase(), EmpresaTittleStyle);
    doc.setFont("helvetica", "normal");

    //linea separacion 1
    const lineaIniX = 0; 
    const lineaFinX = 600; 
    const lineaY = 36;  
    doc.line(lineaIniX, lineaY, lineaFinX, lineaY);    

    ////////////////Datos de la empresa 
    const EmpresaDataStyle = new Style(8, "normal", 1.5);
    const EmpresaDataSection = new Section(
        doc,
        EmpresaTittleSection.x,//
        EmpresaTittleSection.endY + 4,//separacion
        EmpresaDataStyle,
        EmpresaTittleSection.width
    );

    EmpresaDataSection.write(Venta.Direccion.toUpperCase());
    
    if (Venta.DireccionSucursal) {
        EmpresaDataSection.write("Sucursal " +Venta.Sucursal + ": " +Venta.DireccionSucursal);
    }
    if (Venta.TelefonoDos != 0 && Venta.TelefonoTres != 0) {
        EmpresaDataSection.write("Teléfonos: " + Venta.TelefonoDos + " | " + Venta.TelefonoTres);
    } else if (Venta.TelefonoDos != 0 && Venta.TelefonoTres == 0) {
        EmpresaDataSection.write("Teléfono: " + Venta.TelefonoDos);
    } else if (Venta.TelefonoDos == 0 && Venta.TelefonoTres != 0) {
        EmpresaDataSection.write("Teléfono: " + Venta.TelefonoTres);
    }
    EmpresaDataSection.write("Correo: " +Venta.Correo.toUpperCase());

//////////////Factura
    const ComprobanteStyle = new Style(10, "bold", 1.5, 'center');
    const ComprobanteStyleRUC = new Style(14, "bold", 1.2, 'center');//estiloRuc
    const ComprobanteSection = new Section(
        doc,
        143,//x
        8,//y
        ComprobanteStyle,
        60,//largo
        null,//
        2//ancho
    );
    doc.setFont("helvetica", "bold");
    ComprobanteSection.write("R.U.C. "+Venta.Ruc.toUpperCase(),ComprobanteStyleRUC);
    doc.setFont("helvetica", "normal");
    ComprobanteSection.write([        
        Venta.TipoComprobante.toUpperCase(),
        Venta.Serie.toUpperCase() + " - " + Venta.NumeroComprobante
    ]);
    

    const NCComprobanteStyle = new Style(6, "bold", 1.5, 'center');
    const NCComprobanteData = [];
    if (Venta.Motivo) NCComprobanteData.push(Venta.Motivo);
    if (Venta.ComprobanteModificado) NCComprobanteData.push(Venta.ComprobanteModificado);
    if (NCComprobanteData.length > 0) {
        ComprobanteSection.write(NCComprobanteData, NCComprobanteStyle);
    }

    ComprobanteSection.drawBox(3);//Borde        

    /////DATOS DE LA ORDEN DE COMPRA

    const ordenStyle = new Style(10, "bold", 1.5);
    const ordenSection = new Section(
        doc,
        10,//x
        EmpresaDataSection.endY + 4,//y
        ordenStyle,
        null,        
    );
    doc.setFont("helvetica", "bold");
    ordenSection.write(`NUMERO ORDEN : `+Venta.OrdenCompra.toUpperCase());
    doc.setFont("helvetica", "normal");

    /////DATOS DE LA GUIA DE REMISION 
    
    const guiaStyle = new Style(10, "bold", 1.5);
    const guiaSection = new Section(
        doc,
        80,//x
        EmpresaDataSection.endY + 4,//y
        guiaStyle,
        null,        
    );
    doc.setFont("helvetica", "bold");
    guiaSection.write(`NUMERO GUIA : ${Venta.GuiaRemision}`);
    doc.setFont("helvetica", "normal");
    

    //////////////////////////////////CLIENTE

    const clienteStyle = new Style(8, "normal", 1.5);
    const clienteSection = new Section(
        doc,
        10,//x
        EmpresaDataSection.endY + 9, //y
        clienteStyle,
        127,//limit
        null,
        2//ancho
    );
    clienteSection.write("CLIENTE                     : "+Venta.RazonSocial.toUpperCase(), clienteStyle);  
    if(Venta.IdtipoDocumentoCliente == 6){        
        clienteSection.write(`RUC                              : ${Venta.NroTipoDocumento}`);
    }  
    if(Venta.IdtipoDocumentoCliente == 1){
        clienteSection.write(`DNI                              : ${Venta.NroTipoDocumento}`);
    }
    if (Venta.Celular){
        clienteSection.write(`N° CELULAR               : ${Venta.Celular}`);
    }
    if (Venta.ClienteDireccion) {
        clienteSection.write(`DIRECCIÓN                : ${Venta.ClienteDireccion}`);
    }
    if (Venta.aliasPlaca)
        clienteSection.write(`ALIAS/PLACA        : ${Venta.aliasPlaca}`, new Style(9, "bold", 1.5));
    if (Venta.GuiaRemision) {
        clienteSection.write(`GUIA DE REMISIÓN REMITENTE : ${Venta.GuiaRemision.SerieGR}-${Venta.GuiaRemision.NumeroComprobanteGR}`);
    }

    if (!!Venta.OrdenCompra && Venta.OrdenCompra !== '') {
        clienteSection.write(`ORDEN DE COMPRA     : ${Venta.OrdenCompra}`);
    }

    clienteSection.write(`                                                                  `);
    clienteSection.drawBox(3);//borde

    ///FECHA 
    const fechaStyle = new Style(10, "bold", 1.5, 'center');
    const fechaSection = new Section(
        doc,
        173,//x
        EmpresaDataSection.endY + 4,//y
        fechaStyle,
        null,        
    );
    doc.setFont("helvetica", "bold");
    fechaSection.write(`FECHA DE EMISION : 13-05-2024`, fechaStyle);
    doc.setFont("helvetica", "normal");
    ///fechaSection.write(`${moment(Venta.FechaEmision).format("DD-MM-YYYY")}`);
    

    /////////////////////////PAGOS

    const pagoStyle = new Style(8, "bold", 1.5, 'center');
    const pagoSection = new Section(
        doc,
        143,//x
        EmpresaDataSection.endY + 9,//y
        pagoStyle,
        60,//ancho
        null,
        4//largo
    );

    pagoSection.write(`TIPO MONEDA : ${Venta.Abreviatura}`, clienteStyle);
    pagoSection.write(`CONDICION DE PAGO :   ${Venta.IdModalidadPago}`, clienteStyle);
    pagoSection.write(`CANTIDAD DE DIAS :  3`,clienteStyle );
    pagoSection.write(`CATIDAD DE CUOTAS :  3`,clienteStyle );
    pagoSection.drawBox(3);

    //linea separacion 2
    const lineaIniX2 = 0; 
    const lineaFinX2 = 600; 
    const lineaY2 = 68;  
    doc.line(lineaIniX2, lineaY2, lineaFinX2, lineaY2);   

    /////////////TABLA

    const startYTabla = Math.max(ComprobanteSection.endY, clienteSection.endY) + 7;
    doc.setFontSize(8);
    doc.autoTable({
        body: DetalleVentaFormateado,
        bodyStyles: { fontSize: 7 },
        headStyles: { fontSize: 7 },
        startY: startYTabla,
        margin: {
            right: 10,
            left: 10,
            bottom: 10
        },
        columnStyles: {
            NombreProducto: { cellWidth: 60 },
            PrecioVenta: { halign: 'right' },
            Importe: { halign: 'right' },
        },
        styles: {
            overflow: "linebreak",
            lineWidth: 0.1,
            tableWidth: "auto",
            cellWidth: "auto",
            halign: "center"
        },
        PageBreak: "avoid",
        columns: [
            { header: "ITEM", dataKey: "Indice" },
            { header: "CÓDIGO", dataKey: "Codigo" },
            { header: "DESCRIPCIÓN", dataKey: "NombreProducto" },
            { header: "CANTIDAD", dataKey: "Cantidad" },
            { header: "MEDIDA", dataKey: "Unidad" },
            { header: "PRECIO", dataKey: "PrecioVenta" },
            { header: "DESCUENTO", dataKey: "Descuento" },
            { header: "IMPORTE", dataKey: "Importe" }
        ],
        theme: "plain"
    });

    //Informacion pie de pagina 

    const pieStyle1 = new Style ( 6 , "normal"  );
    const pieStyle2 = new Style ( 6 , "bold"  );
    const pieSection = new Section (
        doc,
        10,//x
        293//y
    )
    const pieSection2 = new Section (
        doc,
        153,//x
        293//y
    )
    pieSection.write(Venta.Consultadocumento.toUpperCase(),pieStyle1);
    pieSection2.write(Venta.Representacion.toUpperCase(),pieStyle2);

    /// Numeros de cuentas 

    const numcuenStyle = new Style (6 , "normal" );
    const cuentStyle = new Style(10,"normal");
    const CuentasSection = new Section(
        doc,
        105,//x     
        270,//y
        cuentStyle,
        100,//largo
        null,
        3//ancho
             
    )
    
    let cuentasBancariasEmpresa = "";
    if(cuentasBancarias.length){
        cuentasBancariasEmpresa = cuentasBancarias.map(x => `${x.Banco} ${x.Moneda} NRO.CTA: ${x.NumeroCTA} CCI: ${x.CCI}`)        
    }   
    doc.setFont("helvetica", "bold");
    CuentasSection.write(Venta.Cuentas.toUpperCase(),cuentStyle);
    doc.setFont("helvetica", "normal");
    CuentasSection.write(cuentasBancariasEmpresa,numcuenStyle);

    CuentasSection.drawBox(3);

    
    // // Seccion de QR DATA

    // doc.setFontSize(6);
    // doc.text('DATA',17,292);

    // const Xqr = 10; 
    // const Yqr = 270;  
    // const rectWidthqr = 25;
    // const rectHeightqr = 18; 
    // doc.rect(Xqr, Yqr, rectWidthqr, rectHeightqr);

    // doc.text('IMAGEN QR',17,280);

    // // Seccion de QR XML

    // doc.setFontSize(6);
    // doc.text('XML',52,292);

    // const Xxml = 42; 
    // const Yxml = 270;  
    // const rectWidthxml = 25;
    // const rectHeightxml = 18; 
    // doc.rect(Xxml, Yxml, rectWidthxml, rectHeightxml);

    // doc.text('IMAGEN QR',48,280);


    // // Seccion de QR CDR

    // doc.setFontSize(6);
    // doc.text('CDR',84,292);

    // const Xcd = 74; 
    // const Ycd = 270;  
    // const rectWidthcd = 25;
    // const rectHeightcd = 18; 
    // doc.rect(Xcd, Ycd, rectWidthcd, rectHeightcd);

    // doc.text('IMAGEN QR',80,280);
    
    
    // Tercera Linea de separacion 

    const lineainitX3 = 0; 
    const lineaFinX3 = 600; 
    const lineaY3 = 268;   
    doc.line(lineainitX3, lineaY3, lineaFinX3, lineaY3); 

    ///OBSERVACIONES
    const ObservacionesStyle = new Style(10, "normal");
    const ObservacionesSection = new Section(
        doc,
        10,
        248,
        ObservacionesStyle,
        195,
        null,
        8
    ); //(doc, 10, 0, ObservacionesStyle, 70)

    Venta.Observacion = (Venta.Observacion ? Venta.Observacion : "") + (hasRetencion ? `-RETENCIÓN EN CUOTAS DEL ${Venta.retencion} %` : "")
    const tmpObs = Venta.Observacion

    let observaciones;
    if (Venta.Observacion && Venta.Observacion.length) {
        observaciones = ` ${tmpObs}`;        
    }
    doc.setFont("helvetica", "bold");
    doc.text("OBSERVACIONES:", ObservacionesSection.x-5, ObservacionesSection.y-5,ObservacionesStyle);//MUESTRA SOLO EL MENSAJE OBSERVACIONES EN LA UBICACION REAL
    ObservacionesSection.write("OBSERVACIONES :"+Venta.Observacion.toUpperCase());
    doc.setFont("helvetica", "normal"); 
    
    ObservacionesSection.drawBox(3);

    //////DESCRIPCION
    const LetrasStyle = new Style(8, "normal");
    const LetrasSection = new Section(
        doc,  
        10,//x
        244,//y      
        LetrasStyle
        
    ); //(doc, 10, 0, LetrasStyle, 70))
    
    let letras;
    
    if (Venta.Letras) {
        letras = `SON: ${Venta.Letras}` //salto de linea jspdf text
        if (Venta.IdModalidadPago === "CRÉDITO") {
            letras = letras + `\nCANTIDAD DE DÍAS: ${Venta.CantidadDiasCredito}\nFECHA DE PAGO: ${Venta.FechaPago}`
        }
        if (Venta.PlazoEntrega) {
            letras = letras + `\nPLAZO ENTREGA: ${moment(Venta.PlazoEntrega).format("DD-MM-YYYY")}`
        }
        
    }
    LetrasSection.write(letras,LetrasStyle);

    /////////////////////////////////MONTOSSS 

    const totalesStyle = new Style(10, "bold", 1.15, 'right');
    const totalesTittleSection = new Section(doc,
        150, //x
        // pageHeight - (imgQR.height / 3.779528 + 13), 
        235, //y
        totalesStyle, //estilo
        40//largo
    ); //(doc, 130, 0, totalesStyle, 40)

    let totalesTitle = ["TOTAL:  " + `${Venta.Simbolo}`];

    if (Venta.Redondeo > 0 && showExtraInfo) totalesTitle.push("REDONDEO:  " + `${Venta.Simbolo}`)
    if (Venta.DescuentoTotal > 0) totalesTitle.push("DESCUENTO:  " + `${Venta.Simbolo}`)
    if (Venta.Vuelto > 0) totalesTitle.push("VUELTO:  " + `${Venta.Simbolo}`)
    if (showExtraInfo) totalesTitle.push("T.PAGAR:  " + `${Venta.Simbolo}`)
    if (hasRetencion) totalesTitle.push("IMP. NETO: " + `${Venta.Simbolo}`)


    // if (Venta.IdTipoDocumentoSunat !== VALE) {
    const ImpuestosTitle = [];

    if (Venta.descItems > 0) ImpuestosTitle.push("TOTAL DESC.:  " + `${Venta.Simbolo}`)
    if (Venta.Gravadas > 0) ImpuestosTitle.push("GRAVADO:  " + `${Venta.Simbolo}`)
    if (Venta.Exoneradas > 0) ImpuestosTitle.push("EXONERADO:  " + `${Venta.Simbolo}`)
    if (Venta.Inafectas > 0) ImpuestosTitle.push("INAFECTO:  " + `${Venta.Simbolo}`)
    if (Venta.Gratuitas > 0) ImpuestosTitle.push("GRATUITO:  " + `${Venta.Simbolo}`)
    if (Venta.IGV > 0) ImpuestosTitle.push("IGV:  " + `${Venta.Simbolo}`)
    if (Venta.ICBPER > 0) ImpuestosTitle.push("ICBPER:  " + `${Venta.Simbolo}`)
    if (Venta.ISC > 0) ImpuestosTitle.push("ISC:  " + `${Venta.Simbolo}`)
    if (Venta.IVAP > 0) ImpuestosTitle.push("IVAP:  " + `${Venta.Simbolo}`)

    totalesTitle = [...ImpuestosTitle, ...totalesTitle];
    // }

    // const totalesTitleSectionHeight =
    //     totalesTittleSection.getHeight(totalesTitle) + 17;
    // totalesTittleSection.y = pageHeight - totalesTitleSectionHeight;
    doc.setFont("helvetica", "bold");
    totalesTittleSection.write(totalesTitle,totalesStyle);
    doc.setFont("helvetica", "normal");
    const gravadas = Venta.Gravadas.toFixed(2);
    const exoneradas = String(decimalAdjust('floor', Venta.Exoneradas, -2));
    const inafectas = String(decimalAdjust('floor', Venta.Inafectas, -2));
    const gratuitas = String(decimalAdjust('floor', Venta.Gratuitas, -2));
    let igv = Venta.IGV.toFixed(2);
    let icbper = String(decimalAdjust('floor', Venta.ICBPER, -2));
    let isc = String(decimalAdjust('floor', Venta.ISC, -2));
    let ivap = String(decimalAdjust('floor', Venta.IVAP, -2));
    let total = String(Number(decimalAdjust('round', Venta.Total, -2)).toFixed(2));
    let Redondeo = String(decimalAdjust('floor', Venta.Redondeo, -2));
    let TotalRedondeo = String(decimalAdjust('floor', Venta.TotalRedondeo, -2));
    let descItems = String(decimalAdjust('floor', Venta.descItems, -2))
    const _impNeto = Venta.Total - (Venta.Total * (Venta.retencion / 100))
    const importeNeto = String(decimalAdjust('floor', _impNeto, -2))

    // const vuelto = calculateVueltoToDisplay(Venta);

    let descuento = String(Venta.DescuentoTotal);

    const totalesMontoSection = new Section(doc, 
    165, //x
    // pageHeight - (imgQR.height / 3.779528 + 13),
    235, //y
    totalesStyle,
    40 //largo
    ); //(doc, 160, 0, totalesStyle, 40)

    let totales = [
        `${total}`
    ];

    if (Venta.Redondeo > 0 && showExtraInfo) totales.push(Redondeo)
    if (Venta.DescuentoTotal > 0) totales.push(descuento)
    // if (Venta.Vuelto > 0) totales.push(vuelto)
    if (showExtraInfo) totales.push(TotalRedondeo)
    if (hasRetencion > 0) totales.push(importeNeto)

    // if (Venta.IdTipoDocumentoSunat !== VALE) {
    let Impuestos = [];

    if (Venta.descItems > 0) Impuestos.push(descItems)
    if (Venta.Gravadas > 0) Impuestos.push(gravadas)
    if (Venta.Exoneradas > 0) Impuestos.push(exoneradas)
    if (Venta.Inafectas > 0) Impuestos.push(inafectas)
    if (Venta.Gratuitas > 0) Impuestos.push(gratuitas)
    if (Venta.IGV > 0) Impuestos.push(igv)
    if (Venta.ICBPER > 0) Impuestos.push(icbper)
    if (Venta.ISC > 0) Impuestos.push(isc)
    if (Venta.IVAP > 0) Impuestos.push(ivap)


    totales = [...Impuestos, ...totales];
    // }

    // const totalesMontoHeight = totalesMontoSection.getHeight(totales) + 17;
    // totalesMontoSection.y = pageHeight - totalesMontoHeight;
    // const heightForNonQr = Venta.IdTipoDocumentoSunat === VALE ? 10 : 0
    doc.setFont("helvetica", "bold");
    totalesMontoSection.write(totales,totalesStyle);
    doc.setFont("helvetica", "normal");

    doc.save(`Nuevo_Diseño_Factura.pdf`);
}

export default crearDocPDF;
