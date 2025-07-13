import { Input } from "../components/Input";
import { Info } from "../components/Info"
import { CheckBox } from "../components/CheckBox";
import { NumberStepper } from "../components/NumberStepper";
import { Button } from "../components/Button";
import { Tabla } from "../components/Tabla";
import { useState, useRef } from "react";
import { codigoHamming } from "../logic/CodigoHamming";
import './HammingPage.css'

function HammingPage() {
  const mensajeRef = useRef(null);
  const [simularError, setSimularError] = useState(false);
  const bitErroneoRef = useRef(null); 
  const [resultado, setResultado] = useState('');

   const handleCheckboxChange = (e) => {
    setSimularError(e.target.checked);
  };

  const handleCalcular = () => {
    const mensaje = mensajeRef.current.value;
    const bitErroneo = simularError && bitErroneoRef.current ? bitErroneoRef.current.value : null;
    const resultadoHamming = codigoHamming(mensaje.split("").map(Number), bitErroneo);
    const etiquetas = ["ASCII", ...Array.from({ length: resultadoHamming.matrizEmisor.length - 1 }, (_, i) => `${i + 1}`)];
    // Agregar columna al inicio de cada fila con la etiqueta correspondiente
    const matrizEmisorConEtiqueta = resultadoHamming.matrizEmisor.map((fila, i) => [etiquetas[i], ...fila]);
    const matrizReceptorConEtiqueta = resultadoHamming.matrizReceptor.map((fila, i) => [etiquetas[i], ...fila]);
    const headers = ["", ...Array.from({ length: resultadoHamming.tramaCodificada.length }, (_, i) => `Bit ${i + 1}`)];
    setResultado({
      ...resultadoHamming,
      matrizEmisor: matrizEmisorConEtiqueta,
      matrizReceptor: matrizReceptorConEtiqueta,
      headers,
    });
  };

  const handleLimpiar = () => {
    setResultado('')
    mensajeRef.current.value = "";
    setSimularError(false)
  }
  
  return (
    <div className="hamming-page">
      <h1>Código de Hamming</h1>
      <Input ref={mensajeRef} text={'Mensaje: '} placeholder={'Ej: 1010'}></Input>
      <div className="checkbox-stepper-group">
        <CheckBox text={'Simular Error'} onChange={handleCheckboxChange} checked={simularError}/>
        {simularError && <NumberStepper ref={bitErroneoRef} text={'Bit erróneo:'} />}
      </div>
      <div className="buttons-container">
        <Button label={'Calcular'} onClick={handleCalcular}></Button>
        <Button label={'Limpiar'} onClick={handleLimpiar}></Button>
      </div>
      {resultado && (
        <>
          <Info text={'Trama a Enviar:'} data={resultado.tramaCodificada.join("")} />
          <Info text={'Trama Recibida:'} data={resultado.tramaDañada.join("")} />
          <Info text={'Mensaje obtenido:'} data={resultado.datoFinal.join("")} />
          <h2>Matriz del Emisor</h2>
          <Tabla headers={resultado.headers} data={resultado.matrizEmisor} />
          {/*<Tabla headers={Array.from({ length: resultado.tramaCodificada.length }, (_, i) => `Bit ${i + 1}`)} data={resultado.matrizEmisor} />*/}
          <h2>Matriz del Receptor</h2>
          {/*<Tabla headers={Array.from({ length: resultado.tramaCodificada.length }, (_, i) => `Bit ${i + 1}`)} data={resultado.matrizReceptor} />*/}
          <Tabla headers={resultado.headers} data={resultado.matrizReceptor} />
        </>
      )}

    </div>
  );
}

export default HammingPage;
