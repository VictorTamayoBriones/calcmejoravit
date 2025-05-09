import { useContext } from "react";
import { CalcMejoravitContext } from "../context/CalcMejoravitContext";

export const useCalcMejoravit = () => {

    const context = useContext(CalcMejoravitContext);

    if(!context){
        throw new Error("No se cargo el calcMejoravitContext");
    }

    return context;

};