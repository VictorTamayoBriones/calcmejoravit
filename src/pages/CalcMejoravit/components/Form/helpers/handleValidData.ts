import type { IDataMejoravit } from "@/pages/CalcMejoravit/context/CalcMejoravitContext";

export const handleValidData = (data: IDataMejoravit) => {
    const GESTION = calculaCommisionGestion(Number(data.montoCredito), Number(data.commision));
    const FREE = calculaFree(Number(data.montoCredito), GESTION, Number(data.originacion));

    const DATA: IDataMejoravit = {
        ...data,
        freeToCustomer: FREE < 0 ? '0' : String(FREE),
        gestion: String(GESTION),
    }

    return DATA;
};

function calculaCommisionGestion(monto: number, tasa: number){
    const comision = monto * (tasa/100);
    return comision;
}

function calculaFree(monto: number, gestion: number, originacion: number){
    const free = monto - gestion - originacion;
    return free;
}