import { jsPDF } from "jspdf";
import React, { useRef } from 'react';
import {createRoot} from 'react-dom/client'
import FCliente from './FCliente'
import './App.css'

const root = createRoot(document.getElementById('root'))

function App () {

    const pdfRef = useRef(null);
    
    const generarPDF =() => {
    
        const doc = new jsPDF();
        
        /*const datosCliente = {
            DOCUMENTO:'205366781652',
            CLIENTE:'INVERCIONES MI FACTURA PERUONES MI FACTURA',
            DIRECCION:'Direccion Sucursal: AV. REPÚBLICA DEDireccion Sucursal',
        }*/
    
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
            <FCliente ref={pdfRef} />
            <button onClick={generarPDF}>Generar PDF</button>
        </div>
    );
    
    
    
   
}
root.render(<App />); 

export default App;




/*function App(){         
    
    
    const detailsData = {
        RUC: '20999999999' ,
        FACTURA : 'FACTURA ELECTRONICA',
        SERIE : 'FE02',
        NUMERO: '00015'
    }  
        
    const generarPDF = ()=>{
        const doc = new jsPDF();       
            
        doc.text('CLIENTE' , 92 ,20);
        doc.text(<FCliente> </FCliente>,10,30);
        doc.text(<FCliente> </FCliente>,10.40);
        doc.text(<FCliente> </FCliente>,10.50);

        doc.text(`R.U.C ${detailsData.RUC}`,90 , 90  );
        doc.text(` ${detailsData.FACTURA}` ,90,100);
        doc.text(` ${detailsData.SERIE} `  ,90,110);
        doc.text(` ${detailsData.NUMERO} ` , 110,110 );
            
        doc.save(`factura_${detailsData.FACTURA}.pdf`)
    }
   
    return (             
        
        <section>
            <div> 
                <p>R.U.C: {detailsData.RUC}</p>
                <p> {detailsData.FACTURA} </p>
                <p> {detailsData.SERIE} , {detailsData.NUMERO} </p>
                
                <FCliente/>
                

            </div>            
        
            <button onClick={generarPDF}> GENERAR PDF  </button>
        </section>       
        
     
                    
                    
    )  
      
}
export default App

root.render(
    <App/>
)
*/

       




