import { formatAsNumber, formatToPesos } from '@/pages/CalcMejoravit/components/Form/helpers/formatToPesos';
import type { IDataMejoravit } from '@/pages/CalcMejoravit/context/CalcMejoravitContext';
import { AlignmentType, Document, Packer, Paragraph, SectionType, TextRun } from 'docx';
import { numeroAPalabras } from './numerosALetras';

// Función que recibe un objeto y genera un archivo Word para descarga
export const generateWordFile = (data: IDataMejoravit) => {

    const TOTAL_TO_PAY_AS_NUM = Number(formatAsNumber(data.gestion)) + Number(formatAsNumber(data.originacion));
    const TOTAL_TO_PAY_AS_CURRENCY = formatToPesos(String(TOTAL_TO_PAY_AS_NUM));
    const TOTAL_TO_PAY_AS_TEXT = numeroAPalabras(TOTAL_TO_PAY_AS_NUM);

    downloadReciboDeMaterial(data, TOTAL_TO_PAY_AS_CURRENCY,TOTAL_TO_PAY_AS_TEXT);
    downloadCargoACuenta(data, TOTAL_TO_PAY_AS_CURRENCY);

};

function downloadReciboDeMaterial(data: IDataMejoravit, TOTAL_TO_PAY_AS_CURRENCY: string,TOTAL_TO_PAY_AS_TEXT: string) {
    const TEXT_BODY = `Por este medio yo, ${data.nameCustomer}, identificado con mi credencial para votar (INE) identificada con el número (clave de elector): [CLAVE_LECTOR] y CURP: [CURP]; con domicilio en [DOMICILIO]; certifico que he recibido los siguientes materiales de parte de Grupo Inmobiliario T-Mex, S. de R.L. de C.V.:`;
    const TEXT_PAY = `Lo anterior, corresponde a la totalidad del material solicitado por un monto de ${TOTAL_TO_PAY_AS_CURRENCY} (${TOTAL_TO_PAY_AS_TEXT}) por lo que no existe adeudo pendiente.`;
    const TEXT_END = `Además hago constar que los materiales anteriormente referidos están en perfecto estado y funcionan correctamente, por lo que me encuentro perfectamente satisfecho con ellos.`;
    const GUIONES = data.nameCustomer.split('').map(() => '_').concat("____________").join('');
    const DOC_NAME = `${data.nameCustomer.split(' ').map(word => word.slice(0, 1)).join('')}_ACUSE_RECIBO_DE_MERCANCIA.docx`;

    // Crear un nuevo documento
    const doc = new Document({
        creator: "Grupo a vivir",
        description: "Acuse de recibo de mercancía",
        title: "Acuse de recibo de mercancía",
        styles: {
            default: {
                heading1: {
                    run: {
                        font: "Aptos Display",
                        bold: true
                    }
                },
                document: {
                    run: {
                        size: "11pt",
                        font: "Aptos (body)",
                        color: "000000",
                    },
                    paragraph: {
                        alignment: AlignmentType.LEFT
                    }
                },
            },
            paragraphStyles: [
                {
                    id: "boldAndLeft",
                    name: "boldAndLeft",
                    run: {
                        bold: true,
                    },
                    paragraph: {
                        alignment: 'left',
                    }
                },
                {
                    id: "centerAndBold",
                    name: "centerAndBold",
                    run: {
                        bold: true,
                    },
                    paragraph: {
                        alignment: 'center',
                    }
                },
            ]
        },
        sections: [
            {
                properties: {
                    type: SectionType.CONTINUOUS
                },
                children: [
                    new Paragraph({
                        text: "ACUSE DE RECIBO DE MERCANCÍA",
                        heading: 'Heading1',
                        "alignment": 'center'
                    }),
                    new Paragraph({ children: [new TextRun({ break: 1 })], }),
                    new Paragraph({ text: data.date, style: "boldAndLeft" }),
                    new Paragraph({ children: [new TextRun({ break: 1 })], }),
                    new Paragraph({ text: TEXT_BODY, "alignment": AlignmentType.JUSTIFIED }),
                    new Paragraph({ children: [new TextRun({ break: 1 })], }),
                    new Paragraph({ text: "-MATERIAL 1", style: "boldAndLeft" }),
                    new Paragraph({ text: "-MATERIAL 2", style: "boldAndLeft" }),
                    new Paragraph({ text: "-MATERIAL 3", style: "boldAndLeft" }),
                    new Paragraph({ text: "-MATERIAL 4", style: "boldAndLeft" }),
                    new Paragraph({ text: "-MATERIAL 5", style: "boldAndLeft" }),
                    new Paragraph({ children: [new TextRun({ break: 1 })], }),
                    new Paragraph({ text: TEXT_PAY, }),
                    new Paragraph({ children: [new TextRun({ break: 0 })], }),
                    new Paragraph({ text: TEXT_END, }),
                    new Paragraph({ children: [new TextRun({ break: 1 })], }),
                    new Paragraph({ text: "Firma de recibido:", alignment: "center" }),
                    new Paragraph({ children: [new TextRun({ break: 4 })], }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: GUIONES,
                            }),
                        ],
                    }),
                    new Paragraph({ text: data.nameCustomer, style: "centerAndBold" }),
                ]
            }
        ],
    });

    // Generar el archivo blob
    Packer.toBlob(doc).then(blob => {
        // Crear URL del blob
        const url = window.URL.createObjectURL(blob);

        // Crear un enlace temporal para descargar
        const link = document.createElement('a');
        link.href = url;
        link.download = DOC_NAME;

        // Añadir al DOM y simular clic
        document.body.appendChild(link);
        link.click();

        // Limpiar
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
    });
}

function downloadCargoACuenta(data: IDataMejoravit, TOTAL_TO_PAY_AS_CURRENCY: string) {

    const DATE_TEMP = new Date();
    const TITLE = 'MANDATO DE COBRO Y CONSENTIMIENTO DE CARGO A CUENTA';
    const DATE = `Ciudad __________ a ${DATE_TEMP.getDate()} / ${DATE_TEMP.getMonth()+1 < 10 ? '0'+Number(DATE_TEMP.getMonth()+1) : DATE_TEMP.getMonth()+1 } / ${DATE_TEMP.getFullYear()}`;
    const DOC_NAME = `${data.nameCustomer.split(' ').map(word => word.slice(0, 1)).join('')}_FORMATO_DOMICILIACION_TARJETA.docx`;
    const FIRST_PARAGRAPH = `El que suscribe, ${data.nameCustomer}, en razón de tener celebrado una obligación de pago vigente con la sociedad [*Grupo Inmobiliario T-Mex, S. de R.L. de C.V.] (en adelante TMEX) por la obtención de diversos productos o servicios de manera previa, por medio del presente otorgo a TMEX un mandato de cobro irrevocable, por virtud del cual se autoriza expresamente a TMEX llevar a cabo las gestiones de cobro frente a la institución Financiera denominada [BANCO] (en adelante el Banco), constituyéndose como tercero debidamente autorizado para realizar el cargo a cuenta.`;
    const SECOND_PARAGRAPH = `Por lo anterior, instruyo y autorizo que [BANCO] con base en la información proporcionada, realice el cargo a mi Tarjeta No. [*] , con fecha de vencimiento **/** por la cantidad de ${TOTAL_TO_PAY_AS_CURRENCY}, cargo único que deberá realizarse en cuanto mi trámite quede resuelto. En caso de que no exista saldo suficiente para realizar el cargo, esta instrucción y autorización de cargo a mi cuenta se mantendrá vigente por plazo indeterminado hasta en tanto no se liquide la obligación a mi cargo. Manifestándose que la cuenta determinada no es una cuenta de nómina, y no existen pagos pendientes o cargos que se deban realizar en orden de prelación con respecto a otros cargos solicitados a esa misma cuenta.`;
    const THIRD_PARAGRAPH = `El Banco podrá llevar a cabo ese cargo a partir del primer de la fecha de pago determinada, hasta su total liquidación o hasta donde alcance. Esta instrucción y autorización abarca cualquier accesorio que ese saldo insoluto llegue a generar en términos del acuerdo con TMEX.`;
    const FOUR_PARAGRAPH = `Dicho cargo o cantidad resultante del cargo aplicado se depositarán en la cuenta bancaria que se señala a continuación:`;
    const FINISH_PARAGRAPH = "La presente instrucción constituye una autorización expresa para que se efectúen los pagos señalados a favor de TMEX, en términos de la obligación de pago que se generó por el crédito señalado en el primer párrafo, por lo que el presente se mantendrá vigente hasta en tanto se le notifique a TMEX la liquidación o cumplimiento de la obligación de pago, sin que lo anterior constituya una obligación recurrente o periódica, por lo que en todo momento el pago oportuno será responsabilidad del suscrito, reconociendo totalmente la obligación de pago frente a TMEX.";
    const GUIONES = data.nameCustomer.split('').map(() => '_').concat("____________").join('');


    // Crear un nuevo documento
    const doc = new Document({
        creator: "Grupo a vivir",
        description: "Formato domiciliacion de tarjeta",
        title: "Formato domiciliacion de tarjeta",
        styles: {
            default: {
                heading1: {
                    run: {
                        font: "Bookman Old Style",
                        bold: true
                    }
                },
                document: {
                    run: {
                        size: "10pt",
                        font: "Bookman Old Style",
                        color: "000000",
                    },
                    paragraph: {
                        alignment: AlignmentType.LEFT
                    }
                },
            },
            paragraphStyles: [
                {
                    id: "boldAndRight",
                    name: "boldAndRight",
                    run: {
                        bold: true,
                    },
                    paragraph: {
                        alignment: 'right',
                    }
                },
                {
                    id: "centerAndBold",
                    name: "centerAndBold",
                    run: {
                        bold: true,
                    },
                    paragraph: {
                        alignment: 'center',
                    }
                },
            ]
        },
        sections: [
            {
                properties: {
                    type: SectionType.CONTINUOUS
                },
                children: [
                    new Paragraph({
                        text: TITLE,
                        heading: 'Heading1',
                        "alignment": 'center'
                    }),
                    new Paragraph({ children: [new TextRun({ break: 1 })] }),
                    new Paragraph({ text: DATE, alignment: 'right' }),
                    new Paragraph({ children: [new TextRun({ break: 0 })] }),
                    new Paragraph({ text: FIRST_PARAGRAPH, alignment: AlignmentType.JUSTIFIED }),
                    new Paragraph({ children: [new TextRun({ break: 0 })], }),
                    new Paragraph({ text: SECOND_PARAGRAPH, alignment: AlignmentType.JUSTIFIED }),
                    new Paragraph({ children: [new TextRun({ break: 0 })] }),
                    new Paragraph({ text: THIRD_PARAGRAPH, alignment: AlignmentType.JUSTIFIED }),
                    new Paragraph({ children: [new TextRun({ break: 0 })] }),
                    new Paragraph({ text: FOUR_PARAGRAPH, alignment: AlignmentType.JUSTIFIED }),
                    new Paragraph({ children: [new TextRun({ break: 0 })] }),
                    new Paragraph({ text: 'TITULAR: GRUPO INMOBILIARIO T-MEX, S. DE R.L. DE C.V.', alignment: AlignmentType.JUSTIFIED }),
                    new Paragraph({ text: 'INSTITUCIÓN FINANCIERA: INBURSA', alignment: AlignmentType.JUSTIFIED }),
                    new Paragraph({ text: 'CLABE: 50061454035', alignment: AlignmentType.JUSTIFIED }),
                    new Paragraph({ text: 'CUENTA: 036180500614540353', alignment: AlignmentType.JUSTIFIED }),
                    new Paragraph({ children: [new TextRun({ break: 0 })] }),
                    new Paragraph({ text: FINISH_PARAGRAPH, alignment: AlignmentType.JUSTIFIED }),
                    new Paragraph({ children: [new TextRun({ break: 1 })] }),
                    new Paragraph({ children: [new TextRun({ break: 1 })] }),
                    new Paragraph({ children: [new TextRun({ break: 1 })] }),
                    new Paragraph({ children: [new TextRun({ break: 1 })] }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: GUIONES,
                            }),
                        ],
                    }),
                    new Paragraph({ children: [new TextRun({ break: 0 })] }),
                    new Paragraph({ alignment: AlignmentType.CENTER, text: data.nameCustomer }),
                ]
            }
        ],
    });

    Packer.toBlob(doc).then(blob => {
        // Crear URL del blob
        const url = window.URL.createObjectURL(blob);

        // Crear un enlace temporal para descargar
        const link = document.createElement('a');
        link.href = url;
        link.download = DOC_NAME;

        // Añadir al DOM y simular clic
        document.body.appendChild(link);
        link.click();

        // Limpiar
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
    });
}