import jsPDF from "jspdf";
import React from 'react';
import 'jspdf-autotable';
import { Style , Section } from "./ClasesImpresion";

export async function crearDocPDF(DetallesVenta,Venta,cuentasBancarias=[]) {

    const DetalleVentaFormat = DetallesVenta.map((producto) => {
        return{
            ...producto,
            Cantidad: showTwoDecimals ? Number(decimalAdjust('floor', producto.Cantidad, -2)) : producto.Cantidad,
            PrecioVenta: showTwoDecimals ? Number(decimalAdjust('floor', producto.PrecioVenta, -2)) : producto.PrecioVenta,
            Importe: decimalAdjust('round', producto.Importe, -2),
            Descuento: producto.Descuento
        }
    });
    
    


}


