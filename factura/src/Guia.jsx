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

        doc.setFont("helvetica", "bold");
        doc.text('TOTAL : S/         233.00',10,30); 
        

        doc.save('Diseño_Guia.pdf');


    }
    return (
        <div>
             <button onClick={generarPDF}>Generar Guia PDF</button>
        </div>
 
     );
}
export default PdfGuia

   