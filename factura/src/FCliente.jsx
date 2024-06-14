
export function Cliente(){
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

export default Cliente