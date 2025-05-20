import { Input } from "@components/Input";
import './form.css';
import Commission from "../Commission/Commission";
import Button from "@components/Button/Button";
import { useCalcMejoravit } from "../../hooks/useCalcMejoravit";
import { formatToPesos } from "./helpers/formatToPesos";

export function Form() {

  const { dataMejoravit, handleChange, handleSubmit } = useCalcMejoravit();

  if (!('nameCustomer' in dataMejoravit)) {
    throw new Error("Invalid dataMejoravit structure");
  }

  return (
    <form onSubmit={(e)=>handleSubmit(e)} >
      <div className="dual-container">
        <Input label="Nombre Cliente" placeholder="Jose example example" type="text" fullWidth name="nameCustomer" id="nameCustomer"  value={dataMejoravit.nameCustomer} onChange={(e)=>handleChange(e)} />
        <Input label="NSS" placeholder="" type="number" fullWidth name="nss" id="nss" value={dataMejoravit.nss}  onChange={(e)=>handleChange(e)} maxLength={11} />
      </div>
      <div className="dual-container">
        <Input label="Domicilio del cliente" type="text" fullWidth name="domicilio" id="domicilio" value={dataMejoravit.domicilio} onChange={(e)=>handleChange(e)} />
        <Input label="Monto de crédito" type="text" fullWidth name="montoCredito" id="montoCredito" value={formatToPesos(dataMejoravit.montoCredito, 0)} onChange={(e)=>handleChange(e)} />
      </div>
      <div className="dual-container">
        <Commission/>
        <Input label="Gestión" type="text" fullWidth name="gestion" id="gestion" value={formatToPesos(dataMejoravit.gestion, 0)} onChange={(e)=>handleChange(e)} disabled />
      </div>
      <div className="dual-container">
        <Input label="Originación" type="text" fullWidth name="originacion" id="originacion" value={formatToPesos(dataMejoravit.originacion, 0)} onChange={(e)=>handleChange(e)} disabled />
        <Input label="Libre al cliente" type="text" fullWidth name="freeToCustomer" id="freeToCustomer" value={formatToPesos(dataMejoravit.freeToCustomer, 0)} onChange={(e)=>handleChange(e)} disabled />
      </div>
      <Button type="submit" variant="primary" fullWidth >Guardar</Button>
    </form>
  )
}
