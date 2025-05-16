import { useCallback, useEffect, useState, type ChangeEvent, type FC, type FormEvent, type ReactNode } from "react";
import { CalcMejoravitContext, type IDataMejoravit } from "./CalcMejoravitContext";
import { handleValidData } from "../components/Form/helpers/handleValidData";
import { formatAsNumber, formatToPesos } from "../components/Form/helpers/formatToPesos";
import { formatDate } from "@utils/dateUtils";
//import { downloadFormDataAsTxt } from "@utils/downloadFormDataAsTxt";
import { generateWordFile } from "@utils/generateWordFile";


const formattedDate = () => formatDate(new Date(), 'dayOfWeek, day month year');

const INITIAL_STATE: IDataMejoravit = {
    "date": formattedDate(),
    "nameCustomer": '',
    "nss": '',
    "commision": '',
    "montoCredito": '',
    "gestion": '',
    "originacion": '2000',
    "freeToCustomer": ''
}

export const CalcMejoravitProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const [dataMejoravit, setDataMejoravit] = useState<IDataMejoravit>(INITIAL_STATE);

    const updateDataMejoravit = useCallback((data: Partial<IDataMejoravit>) => {
        setDataMejoravit(prevData => ({ ...prevData, ...data }));
    }, []);

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { id, value, type } = e.target;
        const parsedValue = type === 'number' ? parseFloat(value) || 0 : value;
        if(id === "freeToCustomer"){
            updateDataMejoravit({ 'freeToCustomer': '0' });
        }else if(id === 'nss'){
            if(e.target.value.length>11){
                const value = e.target.value.slice(0,11);
                updateDataMejoravit({ [id]: value });
            }else{
                updateDataMejoravit({ [id]: value });
            }
        }else{
            updateDataMejoravit({ [id]: formatAsNumber(parsedValue) });
        }
    }, [updateDataMejoravit]);

    useEffect(() => {
        // Usar un identificador para evitar el loop infinito
        const validatedData = handleValidData(dataMejoravit);
        
        // Solo actualizar si hay cambios
        if (JSON.stringify(validatedData) !== JSON.stringify(dataMejoravit)) {
            setDataMejoravit(prevData => ({ ...prevData, ...validatedData }));
        }

    }, [dataMejoravit]);

    const contextValue = {
        dataMejoravit,
        updateDataMejoravit,
        handleChange,
        handleSubmit
    };

    function handleSubmit(e: FormEvent<HTMLFormElement>){
        
        e.preventDefault();

        const KEYS_TO_FORMAT = ["commision", "freeToCustomer", "gestion", "montoCredito", "originacion"];
        let data_to_make_files: IDataMejoravit = INITIAL_STATE;

        Object.entries(dataMejoravit).forEach(([key, value]) => {
            data_to_make_files = {
                ...data_to_make_files,
                [key] : KEYS_TO_FORMAT.includes(key) ? formatToPesos(value) : value
            }
        });

        //downloadFormDataAsTxt(data_to_make_files, `${data_to_make_files.nameCustomer.replace(/ /g, '')}-mejoravit`);
        generateWordFile(data_to_make_files);
    };

    return (
        <CalcMejoravitContext.Provider value={contextValue}>
            {children}
        </CalcMejoravitContext.Provider>
    );
};
