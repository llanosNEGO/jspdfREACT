import { jsPDF } from 'jspdf';
import React, { useRef } from 'react';
import Cliente from './FCliente';
import './App.css';

function App() {
    const pdfRef = useRef();

    const generarPDF = async () => {
        const doc = new jsPDF();       

        // Obtener el contenido HTML del componente hijo mediante la referencia
        const content = await pdfRef.current.getHtmlContent();
        if (!content) {
            alert('Error: No se pudo obtener el contenido para generar el PDF.');
            return;
        }

        // Generar el PDF con el contenido HTML obtenido del hijo
        doc.html(content, {
            callback: () => {
                doc.save('Facturacliente.pdf');
            },
            x: 15,
            y: 20,
        });    
    };

    return (
        <div>
            <h1>Generador de PDF</h1>
            {/* Pasar las propiedades necesarias al componente hijo */}
            <Cliente 
                ref={pdfRef}
                DOCUMENTO="205366781652"
                CLIENTE="INVERSIONES MI FACTURA PERUONES MI FACTURA"
                DIRECCION="AV. REPÚBLICA DEDireccion Sucursal"
            />
            <button onClick={generarPDF}>Generar PDF</button>
        </div>
    );  
}

export default App;
