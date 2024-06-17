import { jsPDF } from "jspdf";
import React, { useRef } from 'react';
import {createRoot} from 'react-dom/client'
import Cliente from './FCliente'
import './App.css'

const root = createRoot(document.getElementById('root'))

function App () {

    const pdfRef = useRef(null);
    
    const generarPDF =() => {
    
        const doc = new jsPDF();       
       
        const content = pdfRef.current.getHtmlContent();
        if (!content) {
            alert('Error: No se pudo obtener el contenido para generar el PDF.');
            return;
        }
    
        doc.html(content, {
             
            callback: function (doc) {
                doc.save('Facturacliente2.pdf');
            },
            x:10,
            y:10,
    
        });    
    
    };

    return (
        <div>
            <h1>Generador de PDF</h1>
            <Cliente 
                ref={pdfRef}
                DOCUMENTO='205366781652'
                CLIENTE='INVERSIONES MI FACTURA PERUONES MI FACTURA'
                DIRECCION='Dirección Sucursal: AV. REPÚBLICA DEDireccion Sucursal'        
            />
            <button onClick={generarPDF}>Generar PDF</button>
        </div>
    );
    
    
    
   
}
root.render(<App />); 

export default App;
