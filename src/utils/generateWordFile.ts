import { formatAsNumber, formatToPesos } from '@/pages/CalcMejoravit/components/Form/helpers/formatToPesos';
import type { IDataMejoravit } from '@/pages/CalcMejoravit/context/CalcMejoravitContext';
import { AlignmentType, Document, Packer, Paragraph, SectionType, TextRun } from 'docx';
import { numeroAPalabras } from './numerosALetras';

// Función que recibe un objeto y genera un archivo Word para descarga
export const generateWordFile = (data: IDataMejoravit) => {

    console.log(data);
    downloadReciboDeMaterial(data);
    //downloadCargoACuenta(data);

};

function downloadReciboDeMaterial(data: IDataMejoravit) {
    const TEXT_BODY = `Por este medio yo, ${data.nameCustomer}, identificado con mi credencial para votar (INE) identificada con el número (clave de elector): [CLAVE_LECTOR] y CURP: [CURP]; con domicilio en [DOMICILIO]; certifico que he recibido los siguientes materiales de parte de Grupo Inmobiliario T-Mex, S. de R.L. de C.V.:`;
    const TOTAL_TO_PAY_AS_NUM = Number(formatAsNumber(data.gestion)) + Number(formatAsNumber(data.originacion));
    const TOTAL_TO_PAY_AS_CURRENCY = formatToPesos(String(TOTAL_TO_PAY_AS_NUM));
    const TOTAL_TO_PAY_AS_TEXT = numeroAPalabras(TOTAL_TO_PAY_AS_NUM);
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

// function downloadCargoACuenta(data: IDataMejoravit){
    
//     const DATE_TEMP = new Date();
//     const TITLE = 'MANDATO DE COBRO Y CONSENTIMIENTO DE CARGO A CUENTA';
//     const DATE = `Ciudad __________ a ${DATE_TEMP.getDate()} / ${DATE_TEMP.getMonth()} / ${DATE_TEMP.getFullYear()}`;
//     const DOC_NAME = `${data.nameCustomer.split(' ').map(word => word.slice(0, 1)).join('')}_FORMATO_DOMICILIACION_TARJETA.docx`;

//     // Crear un nuevo documento
//     const doc = new Document({
//         creator: "Grupo a vivir",
//         description: "Formato domiciliacion de tarjeta",
//         title: "Formato domiciliacion de tarjeta",
//         styles: {
//             default: {
//                 heading1: {
//                     run: {
//                         font: "Bookman Old Style",
//                         bold: true
//                     }
//                 },
//                 document: {
//                     run: {
//                         size: "10pt",
//                         font: "Bookman Old Style",
//                         color: "000000",
//                     },
//                     paragraph: {
//                         alignment: AlignmentType.LEFT
//                     }
//                 },
//             },
//             paragraphStyles: [
//                 {
//                     id: "boldAndLeft",
//                     name: "boldAndLeft",
//                     run: {
//                         bold: true,
//                     },
//                     paragraph: {
//                         alignment: 'left',
//                     }
//                 },
//                 {
//                     id: "centerAndBold",
//                     name: "centerAndBold",
//                     run: {
//                         bold: true,
//                     },
//                     paragraph: {
//                         alignment: 'center',
//                     }
//                 },
//             ]
//         },
//         sections: [
//             {
//                 properties: {
//                     type: SectionType.CONTINUOUS
//                 },
//                 children: [
//                     new Paragraph({
//                         text: TITLE,
//                         heading: 'Heading1',
//                         "alignment": 'center'
//                     }),
//                     new Paragraph({ children: [new TextRun({ break: 1 })], }),
//                     new Paragraph({ text: DATE, style: "boldAndLeft" }),
//                     new Paragraph({ children: [new TextRun({ break: 1 })], }),
                   
//                 ]
//             }
//         ],
//     });

//     Packer.toBlob(doc).then(blob => {
//         // Crear URL del blob
//         const url = window.URL.createObjectURL(blob);

//         // Crear un enlace temporal para descargar
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = DOC_NAME;

//         // Añadir al DOM y simular clic
//         document.body.appendChild(link);
//         link.click();

//         // Limpiar
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(link);
//     });
// }