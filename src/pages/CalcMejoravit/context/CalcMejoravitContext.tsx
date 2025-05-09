// ThemeContext.tsx
import { createContext, type ChangeEvent, type FormEvent } from 'react';

export interface IDataMejoravit{
    "date" : string,
    "nameCustomer" : string,
    "nss" : string,
    "commision" : string,
    "montoCredito" : string,
    "gestion" : string,
    "originacion" : string,
    "freeToCustomer" : string
}

// 1. Definimos qué va en nuestro contexto
export interface CalcMejoravitContextProps {
    dataMejoravit: IDataMejoravit,
    updateDataMejoravit: (data: IDataMejoravit | object) => void,
    handleChange: (e:ChangeEvent<HTMLInputElement>)=>void,
    handleSubmit: (e:FormEvent<HTMLFormElement>)=>void
}

// 2. Creamos el Context con valor inicial undefined 
export const CalcMejoravitContext = createContext<CalcMejoravitContextProps | undefined>(undefined);