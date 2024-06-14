import { jsPDF } from "jspdf";
import './App.css'
import React from "react";
import ReactDOM from 'react-dom/client'
import FCliente from './FCliente'

const root = ReactDOM.createRoot(document.getElementById('root'))

function App(){         
        
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


       




