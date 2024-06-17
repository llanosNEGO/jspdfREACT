import React, { forwardRef, useImperativeHandle } from 'react';

 


const Cliente = forwardRef((props, ref) => {
    const {DOCUMENTO,CLIENTE,DIRECCION} = props;
    useImperativeHandle(ref, () => ({
        getHtmlContent: () => {            
            return (`
                <div>
                    <h2>Información del Cliente</h2>
                    <p><strong>Documento:</strong> ${DOCUMENTO}</p>
                    <p><strong>Cliente:</strong> ${CLIENTE}</p>
                    <p><strong>Dirección:</strong> ${DIRECCION}</p>
                </div>`
        
            );               
        }
    }),[DOCUMENTO, CLIENTE, DIRECCION]);

    return (
        <div>
            <h2>Información del Cliente</h2>
            <p>Documento: {DOCUMENTO}</p>
            <p>Cliente: {CLIENTE}</p>
            <p>Dirección: {DIRECCION}</p>
        </div>
    );
});

export default Cliente;
