import { jsPDF } from 'jspdf';
import { Style, Section } from "./ClasesImpresion";
import 'jspdf-autotable';
import {decimalAdjust, doDownload, VALE} from "./Global";
// import { decimalAdjust, calculateVueltoToDisplay } from './../Global';
// import moment from "moment";

// CLASE CONSTRUCTA PARA IMPRIMIR LA LINEA
class DynamicSection {
    constructor(doc, x, y, style, limit = 200) {
        this.doc = doc;
        this.x = x;
        this.y = y;
        this.style = style;
        this.limit = limit;
    }

    write(text, style = this.style) {
        const splitText = this.doc.splitTextToSize(text, this.limit);
        this.doc.setFontSize(style.fontSize);
        this.doc.setFont(this.style.fontFamily, style.fontWeight);
        splitText.forEach(line => {
            this.doc.text(line, this.x, this.y);
            this.y += style.lineHeight * style.fontSize / 2;
        });
    }

    drawLine(offsetX1 = 0, offsetX2 = 0) {
        this.doc.line(this.x + offsetX1, this.y, this.x + this.limit - offsetX2, this.y);
        this.y += this.style.lineHeight * this.style.fontSize / 2;
    }

    getCurrentY() {
        return this.y;
    }
}

function crearCotPDF(DetallesVenta,Venta,cuentasBancarias = [] ) {

    const extraConf = JSON.parse(window.localStorage.getItem('extraConf'));
    const showExtraInfo = extraConf ? extraConf.showExtraInfo : false;
    const showTwoDecimals = extraConf ? extraConf.showTwoDecimals : false;
    const hasRetencion = Number(Venta.retencion) > 0;

    const DetalleVentaFormateado = DetallesVenta.map ((producto) => {
        return {
            ...producto,
            Cantidad: showTwoDecimals ? Number(decimalAdjust('floor', producto.Cantidad, -2)) : producto.Cantidad,
            PrecioVenta: showTwoDecimals ? Number(decimalAdjust('floor', producto.PrecioVenta, -2)) : producto.PrecioVenta,
            //Importe: decimalAdjust('round', producto.Importe, -2),
            Descuento: producto.Descuento
        }
    });

    Venta.descItems = DetalleVentaFormateado.map(d => d.Descuento).reduce((a, b) => a + b, 0);

    let doc = new jsPDF({});

    ///LOGO
    // const logoP = loadLogoByRUC(Venta.Ruc, "logo", extImg);
    // const logo = await logoP;
    // doc.addImage(logo, "JPEG", 10, 16, 50, 13);

    // const pageHeight =
    //     doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    // const pageWidth =
    //     doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    
    //TITULO DE LA EMPRESA
    const EmpresaTittleStyle = new Style(12, "bold", 1.5);
    const EmpresaTittleSection = new Section(
        doc,
        44,//x
        8,//y
        EmpresaTittleStyle,
        100//limite
    );
    doc.setFont("helvetica", "bold");    
    EmpresaTittleSection.write(Venta.Empresa.toUpperCase(), EmpresaTittleStyle);
    doc.setFont("helvetica", "normal");

    ////////////////Datos de la empresa 
    const EmpresadataStyle = new Style(8,"normal",1.5);
    const EmpresadataSection = new Section(
        doc,
        44,
        EmpresaTittleSection.endY + 4,
        EmpresadataStyle,
        100//limite
    );

    EmpresadataSection.write(Venta.Direccion.toUpperCase());
    
    if (Venta.DireccionSucursal) {
        EmpresadataSection.write("Sucursal " +Venta.Sucursal + ": " +Venta.DireccionSucursal);
    }
    if (Venta.TelefonoDos != 0 && Venta.TelefonoTres != 0) {
        EmpresadataSection.write("Teléfonos: " + Venta.TelefonoDos + " | " + Venta.TelefonoTres);
    } else if (Venta.TelefonoDos != 0 && Venta.TelefonoTres == 0) {
        EmpresadataSection.write("Teléfono: " + Venta.TelefonoDos);
    } else if (Venta.TelefonoDos == 0 && Venta.TelefonoTres != 0) {
        EmpresadataSection.write("Teléfono: " + Venta.TelefonoTres);
    }
    EmpresadataSection.write("Correo: " +Venta.Correo.toUpperCase());

    //////Factura detalle

    const ComprobanteStyle = new Style (12,"bold",1.5,'center');
    const ComprobanteStyleRUC = new Style(14, "bold", 1.2, 'center');//estiloRuc
    const ComprobanteSection = new Section(
        doc,
        143,//x
        7,//Y
        ComprobanteStyle,
        60,//largo
        null,
        4//ancho
    );

    doc.setFont("helvetica", "bold");
    ComprobanteSection.write("R.U.C. "+Venta.Ruc.toUpperCase(),ComprobanteStyleRUC);    
    
    ComprobanteSection.write([        
        Venta.TipoComprobante.toUpperCase(),
        Venta.Serie.toUpperCase() + " - " + Venta.NumeroComprobante
    ]);

    const NCComprobanteStyle = new Style(6, "bold", 1.5, 'center');
    const NCComprobanteData = []
    if (Venta.Motivo) NCComprobanteData.push(Venta.Motivo);
    if (Venta.ComprobanteModificado) NCComprobanteData.push(Venta.ComprobanteModificado);
    if (NCComprobanteData.length > 0) {
        ComprobanteSection.write(NCComprobanteData, NCComprobanteStyle);
    }
    doc.setFont("helvetica", "normal");

    ComprobanteSection.drawBox(3);//Borde

    ///linea de separacion 

    const LineaStyle = new Style(8, "bold", 1.5);
    const LineaSection = new DynamicSection(
        doc,
        10,
        ComprobanteSection.endY + 2, // ajusta la posición Y según sea necesario
        LineaStyle,
        194 // límite del ancho de la línea
    );
    LineaSection.drawLine(0, 0); // Dibuja la línea


    /////DATOS DEL CLIENTE
     const clienteStyle = new Style(8, "normal", 1.5);
     const clienteSection = new Section(
         doc,                            // documento pdf
         10,                             // x: posición horizontal de la sección en la página
         EmpresadataSection.endY + 6,    // y: posición vertical de la sección en la página
         clienteStyle,                   // style: estilo que se aplicará al texto contenido en la sección
         127,                            // width: ancho de la sección en unidades de medida
         null,                           // parent: sección padre a la que se asociará esta sección (opcional)
         5                               // marginBottom: margen inferior de la sección
     );
     // clienteSection.write(`                                                                  `);
    clienteSection.write("CLIENTE                     : "+Venta.RazonSocial.toUpperCase(), clienteStyle);  
    if(Venta.IdTipoDocumento == 6){        
        clienteSection.write("RUC                             : "+Venta.NroTipoDocumento.toUpperCase());
    }  
    if(Venta.IdTipoDocumento == 1){
        clienteSection.write(`DNI                              : ${Venta.NroTipoDocumento}`);
    }
    if (Venta.Celular){
        clienteSection.write(`N° CELULAR               : ${Venta.Celular}`);
    }
    if (Venta.DireccionCliente) {
        clienteSection.write(`DIRECCIÓN                : ${Venta.DireccionCliente}`);
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
    clienteSection.drawBox(3);

    ///FECHA 
    const fechaStyle = new Style(10, "bold", 1.5, 'center');
    const fechaSection = new Section(
        doc,
        173,//x
        EmpresadataSection.endY + 5,//y
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
        140,//x
        EmpresadataSection.endY + 9,//y
        pagoStyle,
        63,//ancho
        null,
        4//largo
    );

    pagoSection.write(`TIPO MONEDA : ${Venta.Abreviatura}`, clienteStyle);
    pagoSection.write(`CONDICION DE PAGO :   ${Venta.IdModalidadPago}`, clienteStyle);
    pagoSection.write(`CANTIDAD DE DIAS :  3`,clienteStyle );
    pagoSection.write(`PLAZO ENTREGA MAXIMO : ${Venta.PlazoEntrega}`,clienteStyle );
    pagoSection.drawBox(3);

    ///SEGUNDA LINEA DE SEPARACION
    const Linea2Style = new Style(8, "bold", 1.5);
    const Linea2Section = new DynamicSection(
        doc,
        10,
        EmpresadataSection.endY + 33, // ajusta la posición Y según sea necesario
        Linea2Style,
        194 // límite del ancho de la línea
    );
    Linea2Section.drawLine(0, 0); // Dibuja la línea

    ///TABLA
    const startYTabla = Math.max(ComprobanteSection.endY, clienteSection.endY) + 7;
    doc.setFontSize(8);
    doc.autoTable({
        body: DetalleVentaFormateado,
        bodyStyles: {fontSize: 7},
        headStyles: {fontSize: 7},
        startY: startYTabla,
        margin: {
            right: 10,
            left: 10,
            bottom: 10
        },
        columnStyles: {
            NombreProducto: {cellWidth: 60},
            PrecioVenta: {halign: 'right'},
            Importe: {halign: 'right'},
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
            {header: "ITEM", dataKey: "Indice"},
            {header: "CÓDIGO", dataKey: "Codigo"},
            {header: "DESCRIPCIÓN", dataKey: "NombreProducto"},
            {header: "CANTIDAD", dataKey: "Cantidad"},
            {header: "MEDIDA", dataKey: "Unidad"},
            {header: "PRECIO", dataKey: "PrecioVenta"},
            {header: "DESCUENTO", dataKey: "Descuento"},
            {header: "IMPORTE", dataKey: "Importe"}
        ],
        theme: "plain"
    });


    // if (cuentasBancarias.length) {
    //     const cuentasY = doc.autoTable.previous.finalY + 2;
    //     const cuentasSection = new Section(
    //         doc,
    //         10,
    //         cuentasY + 1,
    //         clienteStyle,
    //         110
    //     )
    //     cuentasSection.write(`CUENTAS: ${Venta.Empresa.toUpperCase()}`)

        // const startCuentasYTabla = cuentasY + 4;
        // doc.autoTable({
        //     body: cuentasBancarias,
        //     bodyStyles: {fontSize: 7},
        //     headStyles: {fontSize: 7},
        //     startY: startCuentasYTabla,
        //     margin: {
        //         right: 10,
        //         left: 10,
        //         bottom: 10
        //     },
        //     styles: {
        //         lineWidth: 0.1,
        //         tableWidth: "auto",
        //         cellWidth: "auto",
        //     },
        //     PageBreak: "avoid",
            // columns: [
            //     {header: "BANCO", dataKey: "banco"},
            //     {header: "MONEDA", dataKey: "moneda"},
            //     {header: "CUENTAS/CORRIENTES", dataKey: "numCuentaCorriente"},
            //     {header: "CUENTAS INTERBANCARIAS", dataKey: "numCuentaInterbancaria"},
            // ],
            // columns: [
            //     {header: "BANCO", dataKey: "Banco"},
            //     {header: "MONEDA", dataKey: "Moneda"},
            //     {header: "CUENTAS/CORRIENTES", dataKey: "NumeroCTA"},
            //     {header: "CUENTAS INTERBANCARIAS", dataKey: "CCI"},
            // ],
            // theme: "plain"
        // })
    // }
    //
    // if (Venta.infoCotizaciones) {
    //     const cuentasY = doc.autoTable.previous.finalY + 2;
    //     const cuentasSection = new Section(
    //         doc,
    //         10,
    //         cuentasY + 1,
    //         clienteStyle,
    //         110
    //     )
    //     Venta.infoCotizaciones.forEach(c => cuentasSection.write(`* ${c}`))
    // }

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


    ////OBSERVACIONES

    const ObservacionesStyle = new Style(9, "normal");
    const ObservacionesSection = new Section(
        doc,
        // (imgQR.width / 3.779528 + 13) - 10,
        // pageHeight - (imgQR.height / 3.779528 + 13) + heightForNonQr, ObservacionesStyle,
        45,//x
        270,//y
        ObservacionesStyle,
        158
        ,//largo
        null,
        9//ancho
    ); //(doc, 10, 0, ObservacionesStyle, 70)

    Venta.Observacion = (Venta.Observacion ? Venta.Observacion : "") + (hasRetencion ? `-RETENCIÓN EN CUOTAS DEL ${Venta.retencion} %` : "")
    const tmpObs = Venta.Observacion

    // let observacionesSectionHeight;
    let observaciones;
    if (Venta.Observacion && Venta.Observacion.length) {
        observaciones = `OBSERVACIONES: ${tmpObs}`;
        // observacionesSectionHeight =
        //     ObservacionesSection.getHeight(observaciones) + 17;
        // ObservacionesSection.y = pageHeight - observacionesSectionHeight - 30;
    }
    doc.setFont("helvetica", "bold");
    doc.text("OBSERVACIONES:", ObservacionesSection.x-5, ObservacionesSection.y-5,ObservacionesStyle);//MUESTRA SOLO EL MENSAJE OBSERVACIONES EN LA UBICACION REAL
    ObservacionesSection.write("OBSERVACIONES :"+Venta.Observacion.toUpperCase());
    doc.setFont("helvetica", "normal"); 

    ObservacionesSection.drawBox(3);

    ///TERCERA LINEA DE SEPARACION
    const Linea3Style = new Style(8, "bold", 1.5);
    const Linea3Section = new DynamicSection(
        doc,
        10, //x
        268, // ajusta la posición Y según sea necesario
        Linea3Style,
        194 // límite del ancho de la línea
    );
    Linea3Section.drawLine(0, 0); // Dibuja la línea

    ////NOTA DETALLE
    const NotatitleStyle = new Style(8,"normal",1.5)
    const NotaStyle = new Style(8,"normal")
    const NotaSection = new Section(
        doc,
        10,
        250,
        NotaStyle,
        196     
    ) 
    doc.setFont("helvetica", "bold");
    NotaSection.write(Venta.nota.toUpperCase(),NotatitleStyle);
    doc.setFont("helvetica", "normal");
    NotaSection.write([
        " "+Venta.nota1.toLowerCase(),
        " "+Venta.nota2.toLowerCase(),
        " "+Venta.nota3.toLowerCase()
    ]);

    /////CUARTA LINEA DE SEPARACION
    const Linea4Style = new Style(8, "bold", 1.5);
    const Linea4Section = new DynamicSection(
        doc,
        10, //x
        249, // ajusta la posición Y según sea necesario
        Linea4Style,
        194 // límite del ancho de la línea
    );
    Linea4Section.drawLine(0, 0); // Dibuja la línea

    //////DESCRIPCION MONTOS
    const LetrasStyle = new Style(8, "normal");
    const LetrasSection = new Section(
        doc,  
        10,//x
        246,//y      
        LetrasStyle
        
    ); //(doc, 10, 0, LetrasStyle, 70))
    
    let letras;
    
    if (Venta.Letras) {
        letras = `SON: ${Venta.Letras}` //salto de linea jspdf text
        if (Venta.IdModalidadPago === "CRÉDITO") {
            letras = letras + `\nCANTIDAD DE DÍAS: ${Venta.CantidadDiasCredito}\nFECHA DE PAGO: ${Venta.FechaPago}`
        }
        // if (Venta.PlazoEntrega) {
        //     letras = letras + `\nPLAZO ENTREGA: ${moment(Venta.PlazoEntrega).format("DD-MM-YYYY")}`
        // }
        
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





    doc.save(`Nuevo_Diseño_Cotizacion.pdf`);

}

export default crearCotPDF;