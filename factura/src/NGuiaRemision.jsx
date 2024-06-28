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

function crearGuiaPPF(DetallesVenta, Venta, cuentasBancarias = []) {
    
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

    EmpresadataSection.write("Direccion :"+Venta.Direccion.toUpperCase());
    
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

    const ComprobanteStyle = new Style (10,"bold",1.5,'center');
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
        Venta.Serie.toUpperCase() + " - " + Venta.NumeroComprobante.toUpperCase()
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

    ///TITULO DATOS DEL TRASLADO
    const datostStyle = new Style (10,"normal")
    const datostSection = new Section (
        doc,
        10,
        33,
        datostStyle
    )
    doc.setFont("helvetica", "bold");
    datostSection.write("DATOS DEL TRASLADO");
    doc.setFont("helvetica", "normal");

    ///DETALLE DATOS DE TRASLADO
    const datosdStyle = new Style (9,"normal",1.5);
    const datosdSection = new Section (
        doc, 
        10,//x
        37,//y
        datosdStyle,
        194,//largo
        null,
        4//ancho        
    );
    datosdSection.write([
        "MOTIVO DE TRASLADO :"+Venta.Motivotraslado.toUpperCase(), 
        "FECHA INICIO TRASLADO :"+Venta.FechaInicio.toUpperCase(),   
        "DOC. RELACIONADO :"+Venta.Relacionado.toUpperCase()
    ]);

    const datosd2Section = new Section (
        doc, 
        111,//x
        37,//y
        datosdStyle,
        194,//largo
        null,
        4//ancho        
    );
    datosd2Section.write([
        "MODALIDAD DE TRANSPORTE :"+Venta.Modalidad.toUpperCase(),
        "PESO BRUTO :"+Venta.Peso.toUpperCase(),
        "CANTIDAD DE BULTOS :"+Venta.Bultos
    ]);

    datosdSection.drawBox(3);//Borde

    ///FECHA 
    const fechaStyle = new Style(10, "bold", 1.5, 'center');
    const fechaSection = new Section(
         doc,
         170,//x
         EmpresadataSection.endY + 3,//y
         fechaStyle,
         null,        
    );
    doc.setFont("helvetica", "bold");
    fechaSection.write(`FECHA DE EMISION : 13-05-2024`, fechaStyle);
    doc.setFont("helvetica", "normal");
    ///fechaSection.write(`${moment(Venta.FechaEmision).format("DD-MM-YYYY")}`);

    ////PUNTO DE PARTIDA
    const ppartidaStyle = new Style(10,"normal",1.5)
    const ppartidaSection = new Section(
        doc,
        10,
        59,
        ppartidaStyle
    )
    doc.setFont("helvetica", "bold");
    ppartidaSection.write("PUNTO DE PARTIDA")
    doc.setFont("helvetica", "normal");

    ///DETALLE PUNTO DE PARTIDA 
    const partidadeStyle = new Style(8,"normal")
    const partidadeSection = new Section(
        doc,
        10,
        64,
        partidadeStyle,
        92,
        null,
        5
    );
    partidadeSection.write(`${Venta.PuntoPartida}`)
    partidadeSection.drawBox(3);//Borde

    ///PUNTO DE LLEGADA
    const pllegadaStyle = new Style(10,"normal",1.5)
    const pllegadaSection = new Section(
        doc,
        108,
        59,
        pllegadaStyle
    )
    doc.setFont("helvetica", "bold");
    pllegadaSection.write("PUNTO DE LLEGADA")
    doc.setFont("helvetica", "normal");

    ///DETALLE PUNTO DE LLEGADA
    const llegadadeStyle = new Style(8,"normal")
    const llegadadeSection = new Section(
        doc,
        105,
        64,
        llegadadeStyle,
        99,
        null,
        5
    );
    llegadadeSection.write(`${Venta.PuntoLlegada}`)
    llegadadeSection.drawBox(3);//Borde

    ////DATOS DEL DESTINATARIO
    const destinaStyle = new Style(10,"normal",1.5)
    const destinaSection = new Section(
        doc,
        10,
        81,
        destinaStyle
    )
    doc.setFont("helvetica", "bold");
    destinaSection.write("DATOS DEL DESTINATARIO")
    doc.setFont("helvetica", "normal");

    ////DETALLE DATOS DEL DESTINATARIO
    const destinadeStyle = new Style(8,"normal",2)
    const destinadeSection = new Section(
        doc,
        10,
        85,
        destinadeStyle,
        92,
        null,
        4
    );
    destinadeSection.write(`${Venta.RazonS}`)
    destinadeSection.write("RUC :"+Venta.docDE.toUpperCase())
    destinadeSection.drawBox(3);//Borde

    ///DATOS DE LOS VEHICULOS
    const vehiculoStyle = new Style(10,"normal",1.5)
    const vehhiculoSection = new Section(
        doc,
        108,
        81,
        vehiculoStyle
    )
    doc.setFont("helvetica", "bold");
    vehhiculoSection.write("DATOS DE LOS VEHICULOS")
    doc.setFont("helvetica", "normal");

    ////DETALLE DATOS DEL LOS VEHICULOS
    const vehiculodeStyle = new Style(8,"normal",2)
    const vehiculodeSection = new Section(
        doc,
        105,
        85,
        vehiculodeStyle,
        99,
        null,
        4
    );
    vehiculodeSection.write(`PRINCIPAL : ${Venta.vehiculo1}                            NUMERO PLACA : ${Venta.placa1}`);
    vehiculodeSection.write(`PRINCIPAL : ${Venta.vehiculo2}                                   NUMERO PLACA : ${Venta.placa2}`);
    
    vehiculodeSection.drawBox(3);//Borde

    ////DATOS DE LOS CONDUCTORES
    const condStyle = new Style(10,"normal",1.5)
    const condSection = new Section(
        doc,
        10,
        103,
        condStyle
    )
    doc.setFont("helvetica", "bold");
    condSection.write("DATOS DE LOS CONDUCTORES")
    doc.setFont("helvetica", "normal");

    //////DETALLE DATOS DE LOS CONDUCTORES 
    const conddeStyle = new Style (8 ,"normal",1.5)
    const conddeSection = new Section (
        doc,
        10,
        108,
        conddeStyle,
        92,
        null,
        4
    );
    conddeSection.write(`PRINCIPAL: ${Venta.conductor1}`)
    conddeSection.write(`DNI-${Venta.dni1}                                     LICENCIA:${Venta.licencia1}`)
    conddeSection.write(`SECUNDARIO: ${Venta.conductor2}`)
    conddeSection.write(`DNI-${Venta.dni2}                                      LICENCIA:${Venta.licencia2}`)
    conddeSection.drawBox(3);//Borde

    ///EMPRESA TRANSPORTISTA
    const transpoStyle = new Style(10,"normal",1.5)
    const transpoSection = new Section(
        doc,
        108,
        103,
        transpoStyle
    )
    doc.setFont("helvetica", "bold");
    transpoSection.write("DATOS DE LOS VEHICULOS")
    doc.setFont("helvetica", "normal");

    ////DETALLE EMPRESA TRANSPORTISTA
    const transpodeStyle = new Style(8,"normal",2)
    const transpodeSection = new Section(
        doc,
        105,
        108,
        transpodeStyle,
        99,
        null,
        8
    );
    transpodeSection.write(`NOMBRE: ${Venta.nombreTransportista}`);
    transpodeSection.write(`RUC: ${Venta.docTransportista}`);
    
    transpodeSection.drawBox(3);//Borde

    ////TABLA DATOS PRODUCTOS 
    const prodStyle = new Style (10,"normal",1.5)
    const prodSection = new Section (
        doc,
        10,
        133,
        prodStyle
    )
    doc.setFont("helvetica","bold");
    prodSection.write("DATOS PRODUCTOS");
    doc.setFont("helvetica","normal");

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
    const obseStyle = new Style (8,"normal")
    const obseSection = new Section (
        doc,
        103,
        265,
        obseStyle,
        55,
        null,
        12
    );
    obseSection.write(`OBSERVACIONES: ${Venta.Observacion}`);
    obseSection.drawBox(3);//Borde

    ////RECIBI CONFORME
    const recStyle = new Style(8,"normal");
    const recSection = new Section (
        doc,
        160,
        265,
        recStyle,
        45,
        null,
        10
    );
    doc.setFont("helvetica", "bold");
    recSection.write(`RECIBI CONFORME: `)
    doc.setFont("helvetica", "normal");
    recSection.drawBox(3);//Borde

    ///LINEA DE SEPARACION
    const Linea3Style = new Style(8, "bold", 1.5);
    const Linea3Section = new DynamicSection(
        doc,
        10, //x
        263, // ajusta la posición Y según sea necesario
        Linea3Style,
        194 // límite del ancho de la línea
    );
    Linea3Section.drawLine(0, 0); // Dibuja la línea




    doc.save('Nueva_Guia_Remision.pdf');
}
export default crearGuiaPPF;