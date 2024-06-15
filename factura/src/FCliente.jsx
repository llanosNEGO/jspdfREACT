import React , { forwardRef, useImperativeHandle } from 'react';

const Cliente = forwardRef((props,ref) => {

    /*const { DOCUMENTO , CLIENTE , DIRECCION } = props;*/
    
    const DOCUMENTO='205366781652';
    const CLIENTE='INVERCIONES MI FACTURA PERUONES MI FACTURA';  
    const DIRECCION='Direccion Sucursal: AV. REPÚBLICA DEDireccion Sucursal'

    useImperativeHandle(ref, () => ({
        getHtmlContent: () => {
          return `
            <div>
              <h2>Información del Cliente</h2>
              <p><strong>Documento:</strong> ${Cliente.DOCUMENTO}</p>
              <p><strong>Cliente:</strong> ${Cliente.CLIENTE}</p>
              <p><strong>Dirección:</strong> ${Cliente.DIRECCION}</p>
            </div>
          `;
        }
    }));


    return (
        <div>
            <h2>Información del Cliente</h2>
            <p>Documento:{Cliente.DOCUMENTO}</p>
            <p>Cliente: {Cliente.CLIENTE}</p>
            <p>Dirección: {Cliente.DIRECCION}</p>
        </div>


    );
});

export default Cliente;











/*export function Cliente(){
    const clientDATA = {
        DOCUMENTO:'205366781652',
        CLIENTE:'INVERCIONES MI FACTURA PERUONES MI FACTURA',
        DIRECCION:'Direccion Sucursal: AV. REPÚBLICA DEDireccion Sucursal'

    }        

    return(

        <div>
            <h4>Cliente</h4>
            <h3>RUC/DNI: {clientDATA.DOCUMENTO}</h3>
            <h3>CLIENTE: {clientDATA.CLIENTE}</h3>
            <h3>DIRECCION: {clientDATA.DIRECCION}</h3>         
        </div>
    )



}

export default Cliente*/