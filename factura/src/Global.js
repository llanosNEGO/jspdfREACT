//Impuestos
export const IGV = 0.18
export const ICBPER = 0.30;
export const IVAP = 0.04;

//Tipos de PrecioPlantilla
export const PRECIO_COSTO = 1;
export const PRECIO_MENOR = 2;
export const PRECIO_MAYOR = 3;
export const PRECIO_VALE = 4;
export const PRECIO_FAMILIAR = 5;
export const PRECIO_ESPECIAL = 6;

//TIPOS COMPROBANTE
export const FACTURA = 2;
export const BOLETA = 4;
export const VALE = 1;
export const NOTA_DE_CREDITO = 8;
export const NOTA_EGRESO = 53;

//TIPOS PAGO
export const EFECTIVO = 1;
export const MASTER = 2;
export const VISA = 3;
export const AMERICAN = 4;
export const OTROS = 5;
export const PAGO_CREDITO = 6;
export const FPAY = 7;
export const TUNKI = 8;
export const PLIN = 9;
export const YAPE = 10;
export const RAPPI = 11;
export const PEDIDO = 13;


export function getTiposPago() {
    return [EFECTIVO, MASTER, VISA, AMERICAN, OTROS, PAGO_CREDITO, FPAY];
}

//MODALIDAD PAGO
export const CONTADO = 1;
export const CREDITO = 2;
export const MIXTO = 3;
export const OTRA_MODALIDAD_PAGO = 4;

//TIPO DOCUMENTO CLIENTE
export const RUC = 6;
export const DNI = 1;
export const CARNE_EXTRANJERIA = 4;
export const PASAPORTE = 7;
export const GENERICO = 99;
export const CEDULA_DIPLOMATICA_IDENTIDAD = 'A';

//PLAZOS DE CRÉDITOS
export const QUINCEDIAS = 1;
export const TREINTADIAS = 2;
export const CUARENTAYCINCODIAS = 3;
export const SESENTADIAS = 4;
export const NOVENTADIAS = 5;
export const CIENTOVEINTEDIAS = 6;
export const CIENTOCINCUENTADIAS = 7;
export const CIENTOOCHENTADIAS = 8;

//IdGrupoAfectacionIGV
export const GRAVADA = 1;
export const EXONERADA = 2;
export const INAFECTA = 3;
export const EXPORTACION = 4;

export const TIPO_MOV_CAJA = {
    SALIDA: "Salida",
    ENTRADA: "Entrada",
}

export const ESTADO_CE = {
    ACEPTADO: "Aceptado",
    ANULADO: "Anulado",
    PENDIENTE: "Pendiente",
    RECHAZADO: "Rechazado",
    NINGUNO: "",
}

export const TIPOS_DOC_SUNAT = {
    OTROS: -1
}

export const COD_TIPO_AFECTACION = {
    INAFECTO_BONIFICACION: '31',
    INAFECTO_ONEROSA: '30',
    EXONERADO_ONEROSA: '20',
    EXONERADO_GRATUITO: '21',
}

//TRIBUTOS
export const TRIBUTO = {
    IGV: 1,
    IVAP: 2,
    ISC: 3,
    ICBPER: 4,
    EXPORTACION: 5,
    GRATUITO: 6,
    EXONERADO: 7,
    INAFECTO: 8,
    OTROS: 9,
}

//Ajuste de decimales -- documentacion: https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Math/floor
export const decimalAdjust = function (type, value, exp) {
    // Si el exp no está definido o es cero...
    if (typeof exp === "undefined" || +exp === 0) {
        return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // Si el valor no es un número o el exp no es un entero...
    if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
        return NaN;
    }
    // Shift
    value = value.toString().split("e");
    value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)));
    // Shift back
    value = value.toString().split("e");
    return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));
}

/** Redondeo decimal
 * Numero, numero de redondeo--- ejemplo round(15.33656, 2)
 * @param {Float} value
 * @param {Int} exp
 */
export const round = function (value, exp) {
    return decimalAdjust('round', value, -exp);
};
// Redondeo hacia abajo
export const floor = function (value, exp) {
    return decimalAdjust('floor', value, -exp);
};
// Redondeo hacia arriba
export const ceil = function (value, exp) {
    return decimalAdjust('ceil', value, -exp);
};
// Formatea una objeto tipo date
export const formatDate = (date, formatstring) => {
    switch (formatstring) {
        case 'dd-mm-yyyy':
            return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        case 'yyyy-mm-dd': {
            const mes = date.getMonth() + 1;
            const dia = date.getDate();
            return `${date.getFullYear()}-${mes < 10 ? `0${mes}` : mes}-${dia < 10 ? `0${dia}` : dia}`;
        }
        default:
            return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`
    }
}

export function getApiDniStrategies() {
    return [
        {
            'url': process.env.REACT_APP_API_V2_CONSULTA_DNI,
            'version': "V2",
            'getData': async function (dni, url) {
                let corsUrl = process.env.REACT_APP_CORS_URL;
                let response = await fetch(`${corsUrl}/${url}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${process.env.REACT_APP_BEARER_TOKEN_API_DNI_V1}`
                    }
                });
                try {
                    let data = await response.json();
                    return {
                        "nombres": data.Nombre,
                        "apPaterno": data.Paterno,
                        "apMaterno": data.Materno,

                    }
                } catch (e) {
                    return {
                        "nombres": ["No se encontró", "No se encontró"],
                        "apPaterno": "No se encontró",
                        "apMaterno": "No se encontró",
                    }
                }
            }
        },
        {
            'url': process.env.REACT_APP_API_V1_CONSULTA_DNI,
            "version": "V1",
            "getData": async function (dni, url) {
                let res = await fetch(`${url}/${dni}`);
                let data = await res.json();
                console.log({data})
                const nombreCompleto = data.name.replace(',',"");
                const nombreArray = nombreCompleto.split(' ');
                let nombre ="";
                let apellidoPaterno = nombreArray[0];
                let apellidoMaterno = nombreArray[1];
                if(nombreArray.length == 4){
                    nombre =  nombreArray[2] + " " + nombreArray[3]

                }
                if(nombreArray.length == 3){
                    nombre =  nombreArray[2]
                }
                return {
                    "nombres": nombre.split(' '),
                    "apPaterno": apellidoPaterno,
                    "apMaterno": apellidoMaterno,
                };
            }
        },
    ];
}

export function calcularTotales(items) {
    const gravados = items.filter(i => i.IdGrupoClasificacionIgv === GRAVADA && !i.Gratuito)
        .map(i => {
            return {...i, PrecioVenta: i.PrecioVenta / 1.18}
        })
        .map(i => (i.PrecioVenta * i.Cantidad) - (i.Descuento / 1.18))
        .reduce((a, b) => a + b, 0)

    const exonerados = items.filter(i => i.IdGrupoClasificacionIgv === EXONERADA && !i.Gratuito)
        .map(i => i.Total)
        .reduce((a, b) => a + b, 0);

    const inafectos = items.filter(i => i.IdGrupoClasificacionIgv === INAFECTA && !i.Gratuito)
        .map(i => i.Total)
        .reduce((a, b) => a + b, 0);

    const gratuitos = items.filter(i => i.Gratuito)
        .map(i => i.Total)
        .reduce((a, b) => a + b, 0);

    const icbper = items
        .filter(i => String(i.IdAfectacionIgv) === AFECTACION_ICBPER_ID || i.Tributos.includes(TRIBUTO.ICBPER))
        .map(i => i.Cantidad * 0.3)
        .reduce((a, b) => a + b, 0);

    const baseConIgv = (gravados * 1.18)

    const total = baseConIgv + exonerados + inafectos + icbper;

    const totalRedondeado = decimalAdjust('floor', total, -1);
    const redondeo = Math.abs((total - totalRedondeado).toFixed(12));

    return {
        gravados,
        exonerados,
        inafectos,
        gratuitos,
        icbper,
        total,
        totalRedondeado,
        redondeo
    }
}

export function calcularTotalesDetMovAlmacen(items) {
    const gravados = items.filter(i => i.IdGrupoClasificacionIgv === GRAVADA && !i.Gratuito)
        .map(i => {
            return {...i, PrecioVenta: i.PrecioVenta / 1.18}
        })
        .map(i => (i.PrecioVenta * i.Cantidad) - (i.Descuento / 1.18))
        .reduce((a, b) => a + b, 0)

    const exonerados = items.filter(i => i.IdGrupoClasificacionIgv === EXONERADA && !i.Gratuito)
        .map(i => i.Total)
        .reduce((a, b) => a + b, 0);

    const fletes = items.map(i => getFlete(i) * i.Cantidad).reduce((a, b) => a + b, 0);

    const inafectos = items.filter(i => i.IdGrupoClasificacionIgv === INAFECTA && !i.Gratuito)
        .map(i => i.Total)
        .reduce((a, b) => a + b, 0);

    const gratuitos = items.filter(i => i.Gratuito)
        .map(i => i.Total)
        .reduce((a, b) => a + b, 0);

    const icbper = items
        .filter(i => String(i.IdAfectacionIgv) === AFECTACION_ICBPER_ID || i.Tributos.includes(TRIBUTO.ICBPER))
        .map(i => i.Cantidad * 0.3)
        .reduce((a, b) => a + b, 0);

    const baseConIgv = (gravados * 1.18)

    const total = baseConIgv + exonerados + inafectos + icbper + fletes ;

    const totalRedondeado = decimalAdjust('floor', total, -1);
    const redondeo = Math.abs((total - totalRedondeado).toFixed(12));

    return {
        gravados,
        exonerados,
        inafectos,
        gratuitos,
        icbper,
        total,
        totalRedondeado,
        redondeo,
        fletes,
        baseConIgv
    }
}

function getFlete(item){
    if(!item.Flete || item.Flete == null || isNaN(item.Flete)){
        return 0;
    }
    return parseFloat(item.Flete)
}

export function calculateCotizaciones(items) {
    let esFree = (x) => x.Gratuito === "1" || x.Gratuito === 1 || x.Gratuito === true;
    console.log({items})
    const gravados = items.filter(i => i.IdGrupoClasificacionIgv === GRAVADA && !esFree(i))
        .map(i => {
            return {...i, precioVenta: dr(i.precioVenta / 1.18), Descuento: i.Descuento? i.Descuento: 0}
        })
        .map(i => (i.precioVenta * i.cantidad) -(i.Descuento / 1.18))
        .reduce((a, b) => a + b, 0)

    const descuento = items.map(i => i.Descuento).reduce((a, b) => a + b, 0);
    const exonerados = items.filter(i => i.IdGrupoClasificacionIgv === EXONERADA).map(i => i.total).reduce((a, b) => a + b, 0);
    const inafectos = items.filter(i => i.IdGrupoClasificacionIgv === INAFECTA).map(i => i.total).reduce((a, b) => a + b, 0);
    const gratuitos = items.filter(i => esFree(i)).map(i => i.total).reduce((a, b) => a + b, 0);
    const icbper = items.filter(i => String(i.idAfectacionIgv) === AFECTACION_ICBPER_ID || i.Tributos.includes(TRIBUTO.ICBPER)).map(i => i.cantidad * 0.3).reduce((a, b) => a + b, 0);

    const baseConIgv = Number((gravados * 1.18).toFixed(6))

    const total = baseConIgv + exonerados + inafectos + icbper;
    const totalRedondeado = decimalAdjust('floor', baseConIgv + exonerados + inafectos + icbper, -1);
    const redondeo = Math.abs(Number(total - totalRedondeado).toFixed(12));

    return {
        gravados,
        exonerados,
        inafectos,
        gratuitos,
        icbper,
        total,
        totalRedondeado,
        redondeo,
        descuento
    }
}

export function calcTotal(item, doDiscount = false, attrCant = 'Cantidad', attrPv = 'PrecioVenta') {
    item[attrCant] = Number(item[attrCant])
    item[attrPv] = Number(item[attrPv])

    if (item.IdGrupoClasificacionIgv === EXONERADA || item.IdGrupoClasificacionIgv === INAFECTA)
        return item[attrCant] * item[attrPv];

    const pv = (item[attrPv] / 1.18)
    return dr((pv * 1.18 * item[attrCant]) - (doDiscount ? item.Descuento : 0), 'floor', 13, 6);
}

export const NUMBER_KEYS = {
    THREE_NUMBER_KEY: 51
}

export const ESTADO_VENTA = {
    PROCESADA: "PROCESADA",
    ANULADA: "ANULADA",
};

export const ESTADO_VALE = {
    PENDIENTE: "PENDIENTE",
    PROCESADO: "PROCESADO",
    ANULADO: "ANULADO",
};

export const TIPO_STOCK = {
    CON_COMPROBANTE: 1,
    SIN_COMPROBANTE: 2,
    CON_COMPROBANTE_PREVENTA: 3,
    STOCK_COMPROMETIDO_VALE: 4,
    SIN_COMPROBANTE_PREVENTA: 5,
}

export const ESTADO_PREVENTA = {
    PROCESADA: "PROCESADA",
    CANCELADA: "CANCELADA",
    GENERADO: "GENERADO"
};

export function convertStrToJson(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return {};
    }
}

export const AFECTACION_ICBPER_ID = '19';

export const ID_TIPO_MOV_ALMACEN = {
    INGRESO: 1,
    SALIDA: 2
};

export const ID_TIPO_TRANSACCION = {
    ID_BONIFICACION: 7
}

export default function dr(n, type = 'floor', places = 13, fix = 12) {
    return Number(Number(decimalAdjust(type, n, places * -1)).toFixed(fix));
}

export function doDownload(url, filename) {

    fetch(url).then(function (t) {
        return t.blob().then((b) => {
                let a = document.createElement("a");
                a.href = URL.createObjectURL(b);
                a.setAttribute("download", filename);
                a.click();
            }
        );
    });
}
