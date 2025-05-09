import {  Form, Header } from "./components";
import { CalcMejoravitProvider } from "./context/CalcMejoravitProvider";

export const CalcMejoravit = () => {
  return (
    <CalcMejoravitProvider>
      <>
        <Header />
        <Form />
        <p>El saldo presentado con anterioridad es meramente representativo, ya que el real se mostrará hasta el momento de  la inscripción.</p>
      </>
    </CalcMejoravitProvider>
  )
}

