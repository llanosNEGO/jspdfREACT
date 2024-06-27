
export async function crearDocPDF(DetallesVenta, Venta, extImg = 'png', cuentasBancarias = []) {
    const extraConf = JSON.parse(window.localStorage.getItem('extraConf'))
    const showExtraInfo = extraConf ? extraConf.showExtraInfo : false;
    const showTwoDecimals = extraConf ? extraConf.showTwoDecimals : false;
    const hasRetencion = Number(Venta.retencion) > 0

    const DetalleVentaFormateado = DetallesVenta.map((producto) => {
        return {
            ...producto,
            Cantidad: showTwoDecimals ? Number(decimalAdjust('floor', producto.Cantidad, -2)) : producto.Cantidad,
            PrecioVenta: showTwoDecimals ? Number(decimalAdjust('floor', producto.PrecioVenta, -2)) : producto.PrecioVenta,
            Importe: decimalAdjust('round', producto.Importe, -2),
            Descuento: producto.Descuento
        }
    })

    Venta.descItems = DetalleVentaFormateado.map(d => d.Descuento).reduce((a, b) => a + b, 0);

    let doc = new jsPDF({});

    const logoP = loadLogoByRUC(Venta.Ruc, "logo", extImg);

    const logo = await logoP;
    doc.addImage(logo, "JPEG", 10, 16, 50, 13);

    const pageHeight =
        doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth =
        doc.internal.pageSize.width || doc.internal.pageSize.getWidth();


    const EmpresaTittleStyle = new Style(9, "bold", 1.5);
    const EmpresaTittleSection = new Section(
        doc,
        65,
        10,
        EmpresaTittleStyle,
        60
    );

    EmpresaTittleSection.write(Venta.Empresa.toUpperCase(), EmpresaTittleStyle);
    const EmpresaDataStyle = new Style(8, "normal", 1.5);
    const EmpresaDataSection = new Section(
        doc,
        EmpresaTittleSection.x,
        EmpresaTittleSection.endY + 3,
        EmpresaDataStyle,
        EmpresaTittleSection.width
    );

    EmpresaDataSection.write(Venta.Direccion.toUpperCase());
    EmpresaDataSection.write(Venta.Sucursal.toUpperCase());
    if (Venta.DireccionSucursal) {
        EmpresaDataSection.write("Direccion Sucursal: " + Venta.DireccionSucursal);
    }
    if (Venta.TelefonoDos != 0 && Venta.TelefonoTres != 0) {
        EmpresaDataSection.write("Teléfonos: " + Venta.TelefonoDos + " | " + Venta.TelefonoTres);
    } else if (Venta.TelefonoDos != 0 && Venta.TelefonoTres == 0) {
        EmpresaDataSection.write("Teléfono: " + Venta.TelefonoDos);
    } else if (Venta.TelefonoDos == 0 && Venta.TelefonoTres != 0) {
        EmpresaDataSection.write("Teléfono: " + Venta.TelefonoTres);
    }

    const ComprobanteStyle = new Style(15, "bold", 1.5, 'center');
    const ComprobanteSection = new Section(
        doc,
        130,
        11,
        ComprobanteStyle,
        70,
        null,
        2
    );

    ComprobanteSection.write([
        "R.U.C. " + Venta.Ruc,
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

    ComprobanteSection.drawBox(1)

    ////Datos del cliente
    const clienteStyle = new Style(8, "normal", 1.5);
    const clienteSection = new Section(
        doc,                            // documento pdf
        10,                             // x: posición horizontal de la sección en la página
        EmpresaDataSection.endY + 5,    // y: posición vertical de la sección en la página
        clienteStyle,                   // style: estilo que se aplicará al texto contenido en la sección
        115,                            // width: ancho de la sección en unidades de medida
        null,                           // parent: sección padre a la que se asociará esta sección (opcional)
        3                               // marginBottom: margen inferior de la sección
    );
    // clienteSection.write(`                                                                  `);
    clienteSection.write(`CLIENTE                       : ${Venta.RazonSocial}`, clienteStyle);
    clienteSection.write(`DOC. IDENTIDAD         : ${Venta.NroTipoDocumento}`);
    if (Venta.Celular) {
        clienteSection.write(`N° CELULAR                 : ${Venta.Celular}`);
    }
    if (Venta.ClienteDireccion) {
        clienteSection.write(`DIRECCIÓN                  : ${Venta.ClienteDireccion}`);
    }
    if (Venta.aliasPlaca)
        clienteSection.write(`ALIAS/PLACA          : ${Venta.aliasPlaca}`, new Style(9, "bold", 1.5));
    if (Venta.GuiaRemision) {
        clienteSection.write(`GUIA DE REMISIÓN REMITENTE  : ${Venta.GuiaRemision.SerieGR}-${Venta.GuiaRemision.NumeroComprobanteGR}`);
    }

    if (!!Venta.OrdenCompra && Venta.OrdenCompra !== '') {
        clienteSection.write(`ORDEN DE COMPRA       : ${Venta.OrdenCompra}`);
    }

    clienteSection.write(`                                                                  `);


    clienteSection.drawBox(1)


    const fechaStyle = new Style(8, "bold", 1.5, 'center');
    const fechaSection = new Section(
        doc,                            // documento pdf
        130,                             // x: posición horizontal de la sección en la página
        EmpresaDataSection.endY + 5,    // y: posición vertical de la sección en la página
        fechaStyle,                   // style: estilo que se aplicará al texto contenido en la sección
        70,                            // width: ancho de la sección en unidades de medida
        null,                           // parent: sección padre a la que se asociará esta sección (opcional)
        1                               // marginBottom: margen inferior de la sección
    );
    fechaSection.write(`FECHA EMISION:`, fechaStyle);
    fechaSection.write(`${moment(Venta.FechaEmision).format("DD-MM-YYYY")}`);
    
    fechaSection.drawBox(1)

    const pagoStyle = new Style(8, "bold", 1.5, 'center');
    const pagoSection = new Section(
        doc,                            // documento pdf
        130,                             // x: posición horizontal de la sección en la página
        EmpresaDataSection.endY + 15,    // y: posición vertical de la sección en la página
        pagoStyle,                   // style: estilo que se aplicará al texto contenido en la sección
        70,                            // width: ancho de la sección en unidades de medida
        null,                           // parent: sección padre a la que se asociará esta sección (opcional)
        2                               // marginBottom: margen inferior de la sección
    );
    
    pagoSection.write(`TIPO MONEDA :                                                 ${Venta.Abreviatura}`, clienteStyle);
    pagoSection.write(`TIPO PAGO :                                           ${Venta.IdModalidadPago}`, clienteStyle);   
    pagoSection.drawBox(1)

    
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

    let finalTable = doc.autoTable.previous.finalY;

    let QR = await QRCode.toDataURL(
        Venta.Ruc +
        "|" +
        Venta.CodigoTipoComprobante +
        "|" +
        Venta.Serie +
        "|" +
        Venta.NumeroComprobante +
        "|" +
        Venta.IGV +
        "|" +
        Venta.Total +
        "|" +
        moment(Venta.FechaEmision).format("DD-MM-YYYY") +
        "|" +
        Venta.CodigoDocumentoCliente +
        "|" +
        Venta.NroTipoDocumento +
        "|"
    );
    const imgQR = await getLoadImage(QR)
    const imgQRmmHeight = imgQR.height / 3.779528 + 13;

    if (pageHeight - finalTable <= 40)
        doc.addPage()
    const totalesStyle = new Style(10, "bold", 1.15, 'right');
    const totalesTittleSection = new Section(doc, 130, pageHeight - (imgQR.height / 3.779528 + 13), totalesStyle, 40); //(doc, 130, 0, totalesStyle, 40)

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

    const totalesTitleSectionHeight =
        totalesTittleSection.getHeight(totalesTitle) + 17;
    totalesTittleSection.y = pageHeight - totalesTitleSectionHeight;

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

    const vuelto = calculateVueltoToDisplay(Venta);

    let descuento = String(Venta.DescuentoTotal);

    const totalesMontoSection = new Section(doc, 160, pageHeight - (imgQR.height / 3.779528 + 13), totalesStyle, 40); //(doc, 160, 0, totalesStyle, 40)

    let totales = [
        `${total}`
    ];

    if (Venta.Redondeo > 0 && showExtraInfo) totales.push(Redondeo)
    if (Venta.DescuentoTotal > 0) totales.push(descuento)
    if (Venta.Vuelto > 0) totales.push(vuelto)
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

    const totalesMontoHeight = totalesMontoSection.getHeight(totales) + 17;
    totalesMontoSection.y = pageHeight - totalesMontoHeight;
    const heightForNonQr = Venta.IdTipoDocumentoSunat === VALE ? 10 : 0

    const CuentasStyle = new Style(8, "bold");
    const CuentasSection = new Section(doc, (imgQR.width / 3.779528 + 13) - 47, pageHeight- (imgQR.height / 3.779528 + 13)  + heightForNonQr , CuentasStyle, 150); //(doc, 10, 0, ObservacionesStyle, 70)
    let CuentasSectionHeight;
    let cuentasBancariasEmpresa = "";
    if(cuentasBancarias.length){
        cuentasBancariasEmpresa = cuentasBancarias.map(x => `BANCO: ${x.Banco} MONEDA: ${x.Moneda} NRO.CTA: ${x.NumeroCTA} CCI: ${x.CCI}`)
        CuentasSectionHeight =
            CuentasSection.getHeight(cuentasBancariasEmpresa) + 20;
        CuentasSection.y = pageHeight - CuentasSectionHeight - 40;
    }

    const ObservacionesStyle = new Style(9, "normal");
    const ObservacionesSection = new Section(doc, (imgQR.width / 3.779528 + 13) - 10, pageHeight - (imgQR.height / 3.779528 + 13) + heightForNonQr, ObservacionesStyle, 82); //(doc, 10, 0, ObservacionesStyle, 70)

    Venta.Observacion = (Venta.Observacion ? Venta.Observacion : "") + (hasRetencion ? `-RETENCIÓN EN CUOTAS DEL ${Venta.retencion} %` : "")
    const tmpObs = Venta.Observacion

    let observacionesSectionHeight;
    let observaciones;
    if (Venta.Observacion && Venta.Observacion.length) {
        observaciones = `OBSERVACIONES: ${tmpObs}`;
        observacionesSectionHeight =
            ObservacionesSection.getHeight(observaciones) + 17;
        ObservacionesSection.y = pageHeight - observacionesSectionHeight - 30;
    }


    const LetrasStyle = new Style(9, "bold");
    const LetrasSection = new Section(doc, (imgQR.width / 3.779528 + 13) - 10, ObservacionesSection.getHeight(observaciones) + ObservacionesSection.y + 3.5, LetrasStyle, 82); //(doc, 10, 0, LetrasStyle, 70))
    let LetrasSectionHeight;
    let letras;
    let obsHeight;
    if (Venta.Letras) {
        letras = `SON: ${Venta.Letras}\nMODALIDAD DE PAGO: ${Venta.IdModalidadPago}` //salto de linea jspdf text
        if (Venta.IdModalidadPago === "CRÉDITO") {
            letras = letras + `\nCANTIDAD DE DÍAS: ${Venta.CantidadDiasCredito}\nFECHA DE PAGO: ${Venta.FechaPago}`
        }
        if (Venta.PlazoEntrega) {
            letras = letras + `\nPLAZO ENTREGA: ${moment(Venta.PlazoEntrega).format("DD-MM-YYYY")}`
        }
        LetrasSectionHeight = LetrasSection.getHeight(letras) + 5;
        obsHeight = observacionesSectionHeight
            ? (pageHeight - observacionesSectionHeight - 8)
            : (pageHeight - LetrasSectionHeight - imgQRmmHeight + 16);
    }

    const maxHeightFooter = Math.max(
        imgQRmmHeight - 4,
        observacionesSectionHeight,
        totalesTitleSectionHeight,
        totalesMontoHeight,
        LetrasSectionHeight,
        CuentasSectionHeight
    );
    if (finalTable + 3 + maxHeightFooter > pageHeight) {
        doc.addPage();
    }
    if (Venta.IdTipoDocumentoSunat !== VALE) {
        doc.addImage(imgQR, "PNG", 6, pageHeight - imgQRmmHeight + 2, 35, 35);
    }
    doc.setFontSize(8);
    doc.setFontType("italic");

    const logom = loadImagePublic("/mifacturaperu.png");
    const logoMFP = await logom;

    doc.addImage(logoMFP, "PNG", 10, pageHeight - 19.5, 23, 15);
    doc.text(`ENCUENTRAME EN SUNAT COMO: ${String(Number(decimalAdjust('round', Venta.Total, -2)).toFixed(2))}`, 34, pageHeight - 12);
    doc.text("PARA CONSULTAR EL DOCUMENTO VISITA WWW.MIFACTURAPERU.COM", 34, pageHeight - 8);
    LetrasSection.write(letras);
    CuentasSection.write(cuentasBancariasEmpresa);

    const mensaje = await(async () => {
        try {
            const fetchMensaje = await fetch('/api/cotizaciones/imprimir/mensaje');

            if (!fetchMensaje.ok) {
                throw new Error(`HTTP error! status: ${fetchMensaje.status}`);
            }

            const { respuesta } = await fetchMensaje.json();

            if (!respuesta || !('Mensaje' in respuesta)) {
                throw new Error('No se pudo obtener el mensaje');
            }

            return respuesta.Mensaje.toUpperCase();
        } catch (e) {
            console.error(e)
        }

        return null;
    })();
    
    if ('EsCotizacion' in Venta && Venta.EsCotizacion && mensaje) {
        CuentasSection.write(mensaje);
    }

    observaciones && ObservacionesSection.write(observaciones);
    totalesTittleSection.write(totalesTitle);
    totalesMontoSection.write(totales);

    const finalA4 = totalesMontoSection.endY - 10;

    if (Venta.IdTipoDocumentoSunat === VALE) {
        const NoValidoStyle = new Style(10, "bold", 1);

        const NoValidoSection = new Section(doc, 12, finalA4, NoValidoStyle, 80);
        NoValidoSection.write("NO ES UN COMPROBANTE DE PAGO");
    }
    return doc;
}