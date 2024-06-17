import React, { forwardRef, useImperativeHandle } from 'react';

const Cliente = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        getHtmlContent: () => {
            return `
                <div>
                    <h2>Información del Cliente</h2>
                    <p><strong>Documento:</strong> ${props.DOCUMENTO}</p>
                    <p><strong>Cliente:</strong> ${props.CLIENTE}</p>
                    <p><strong>Dirección:</strong> ${props.DIRECCION}</p>
                </div>
            `;
        }
    }));

    return (
        <div>
            <h2>Información del Cliente</h2>
            <p>Documento: {props.DOCUMENTO}</p>
            <p>Cliente: {props.CLIENTE}</p>
            <p>Dirección: {props.DIRECCION}</p>
        </div>
    );
});

export default Cliente;
