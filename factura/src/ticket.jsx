import { jsPDF } from 'jspdf';
import { Style, Section } from "./ClasesImpresion";
import 'jspdf-autotable';

export const registroMovCajaPDF = async (data, isCopy = false) => {
    // let infoPdf = await TraerInfoPDF(data.idTurno);
    const infoPdf = data.infoPDF;
    const mmPageSize = [80, 3276];

    const ptPageSize = mmPageSize.map(coord => coord * 2.83465);
    var doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: ptPageSize
    });

    // let nombreArchivo = `${moment(new Date()).format('YYYY_MM_DD-HH_mm')}` + "-" + `${infoPdf[0][0][0].NombreCaja}`;

    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    
    //const logoP = loadLogoByRUC(infoPdf[0][0][0].Ruc, 'logo', data.extImg);
    //const logo = await logoP;
    //doc.addImage(logo, "JPEG", 9, 5, 60, 18);

    //ESTILOS PARA NOMBRE CAJA, ES ESTILO PRINCIPAL
    const ComprobanteStyle = new Style(10, "bold", 1.3, 'center');
    const ComprobanteSection = new Section(
        doc,
        3,
        18,  
        ComprobanteStyle,
        74,
        null,
        1
    );

    /** EMPRESA**/
    const EmpresaTittleStyle = new Style(14, "bold", 1, 'center');
    const EmpresaTittleSection = new Section(
        doc,
        4,
        5,
        EmpresaTittleStyle,
        ComprobanteSection.width
    );

    EmpresaTittleSection.write(`${infoPdf[0][0][0].Empresa}`.toUpperCase());


    /** HORA DE CREACIÓN **/

    const HoraStyle = new Style(10, "normal", 1, 'center'); // Tamaño pequeño y centrado
    const HoraSection = new Section(
        doc,
        4,
        EmpresaTittleSection.endY + 3, // Posición debajo del título de la empresa
        HoraStyle,
        ComprobanteSection.width
    );

    const horaCreacion = new Date().toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    }); // Formato HH:MM:SS

    HoraSection.write(`Hora de Creación: ${horaCreacion}`);

    /** MENSAJE PREVENTA**/

    const headers = [isCopy ? "MOVIMIENTO DE CAJA (COPIA)" : `${infoPdf[0][0][0].NombreCaja}`.toUpperCase()]

    ComprobanteSection.write(headers); //mostrar dos string en el mismo write
    ComprobanteSection.drawBorder(false, true);

    /** CODIGO PREVENTA**/

    const ComprobanteCodigoStyle = new Style(14, "bold", 1, 'center');
    const ComprobanteCodigoSection = new Section(
        doc,
        4,
        ComprobanteSection.endY + 3.2,
        ComprobanteCodigoStyle,
        ComprobanteSection.width
    );

    
    const codigo = [isCopy ? "CODIGO" : `${infoPdf[0][0][0].codigo}`.toUpperCase()];

    ComprobanteCodigoSection.write(codigo);

    const lineStartX = ComprobanteCodigoSection.x;
    const lineEndX = ComprobanteCodigoSection.x + ComprobanteCodigoSection.width;
    const lineY = ComprobanteCodigoSection.endY + 3.2;

    doc.line(lineStartX, lineY, lineEndX, lineY);


    /** CLIENTE**/

    const usuarioStyle = new Style(8, "normal", 1);
    const usuarioSection = new Section(
        doc,
        4,
        ComprobanteSection.endY + 12,
        usuarioStyle,
        ComprobanteSection.width
    );

    usuarioSection.write(`DOC: ${infoPdf[0][0][0].Ruc}`);
    usuarioSection.write(`CLIENTE: ${infoPdf[0][0][0].NombreCliente}`);
    usuarioSection.write(` `);


    // const TipoMovStyle = new Style(10, "normal", 1, 'left');
    // const TipoMovSection = new Section(
    //     doc,
    //     3,
    //     usuarioSection.endY + 2,
    //     TipoMovStyle,
    //     pageWidth - 6,
    //     null,
    //     1
    // );
    // TipoMovSection.write(`TIPO DE MOVIMIENTO: ${data.data.TipoMovimiento.toUpperCase()}        ` + `MONTO: S./ ${decimalAdjust('round', data.data.Monto, -2)}`,);
    // TipoMovSection.drawBorder(false, true)


    // const ObservacionStyle = new Style(10, "normal", 1, 'left');
    // const ObservacionSection = new Section(
    //     doc,
    //     3,
    //     TipoMovSection.endY + 2,
    //     ObservacionStyle,
    //     pageWidth - 6,
    //     null,
    //     1
    // );
    // ObservacionSection.write(`OBSERVACION: ${data.data.Observacion ? data.data.Observacion.toUpperCase() : 'No hay observaciones.'}`);

    // const LineaStyle = new Style(10, "normal", 1, 'left');
    // const LineaSection = new Section(
    //     doc,
    //     3,
    //     ObservacionSection.endY + 4,
    //     LineaStyle,
    //     pageWidth - 6,
    //     null,
    //     1
    // );
    // LineaSection.write(`________________`,);
    // const FirmaStyle = new Style(10, "normal", 1, 'left');
    // const FirmaSection = new Section(
    //     doc,
    //     3,
    //     LineaSection.endY + 1,
    //     FirmaStyle,
    //     pageWidth - 6,
    //     null,
    //     1
    // );
    // FirmaSection.write(`           firma`,);

    const bloburl = doc.output("bloburl");

    // Crear un enlace para descargar el PDF
    const downloadLink = document.createElement('a');
    downloadLink.href = bloburl;
    downloadLink.download = 'ticket.pdf'; // Nombre del archivo
    downloadLink.click();

}