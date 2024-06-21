import { jsPDF } from 'jspdf';
import { Style, Section } from "./ClasesImpresion";
import 'jspdf-autotable'
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
        40, //x
        10, //y
        EmpresaTittleStyle,
          //limit
    );
    doc.setFont("helvetica", "bold");    
    EmpresaTittleSection.write(Venta.Empresa.toUpperCase(), EmpresaTittleStyle);
    doc.setFont("helvetica", "normal");

    //linea separacion 1
    const lineaIniX = 0; 
    const lineaFinX = 600; 
    const lineaY = 35;  
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
//////////////Factura
    const ComprobanteStyle = new Style(10, "bold", 1.5, 'center');
    const ComprobanteStyleRUC = new Style(14, "bold", 1.2, 'center');//estiloRuc
    const ComprobanteSection = new Section(
        doc,
        143,//x
        12,//y
        ComprobanteStyle,
        60,//largo
        null,//noc
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

    //////////////////////////////////CLIENTE
    const clienteStyle = new Style(8, "normal", 1.5);
    const clienteSection = new Section(
        doc,
        10,//x
        EmpresaDataSection.endY + 6, //y
        clienteStyle,
        127,//limit
        null,//noc
        3//ancho
    );

    clienteSection.write("CLIENTE                     : "+Venta.RazonSocial.toUpperCase(), clienteStyle);    
    clienteSection.write(`DOC. IDENTIDAD       : ${Venta.NroTipoDocumento}`);
    if (Venta.Celular) {
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
        EmpresaDataSection.endY + 5,//y
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
        EmpresaDataSection.endY + 10,//y
        pagoStyle,
        60,//ancho
        null,
        2//largo
    );

    pagoSection.write(`TIPO MONEDA : ${Venta.Abreviatura}`, clienteStyle);
    pagoSection.write(`CONDICION DE PAGO :   ${Venta.IdModalidadPago}`, clienteStyle);
    pagoSection.write(`CANTIDAD DE DIAS :  3`,clienteStyle );
    pagoSection.write(`CATIDAD DE CUOTAS :  3`,clienteStyle );
    pagoSection.drawBox(3);

    //linea separacion 2
    const lineaIniX2 = 0; 
    const lineaFinX2 = 600; 
    const lineaY2 = 62;  
    doc.line(lineaIniX2, lineaY2, lineaFinX2, lineaY2);   

    //TABLA

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

    // Ajustes finales...

    doc.save(`${Venta.NumeroComprobante}.pdf`);
}

export default crearDocPDF;
