import { useRef, useState } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Info } from "../components/Info";
import { Division } from "../components/Division";
import { generateTrama } from "../logic/CRC";
import './CRCPage.css'

function CRCPage() {
  const mensajeRef = useRef();
  const generadorRef = useRef();
  const [resultado, setResultado] = useState('');
  
  const handleCalcular = () => {
    const mensaje = mensajeRef.current.value;
    const generador = generadorRef.current.value;
    const resultadoCRC = generateTrama(mensaje.split("").map(Number), generador.split("").map(Number));
    setResultado(resultadoCRC)
  };

  const handleLimpiar = () => {
    mensajeRef.current.value = "";
  }

  return (
    <div className="crc-page">
      <h1>Código de Redundancia Cíclica(CRC)</h1>
      <Input ref={mensajeRef} text={'Mensaje: '} placeholder={'Ej: 1010'}></Input>
      <Input ref={generadorRef} text={'Generador: '} placeholder={'Ej: 1010'}></Input>

      <div className="buttons-container">
        <Button label={'Calcular'} onClick={handleCalcular}></Button>
        <Button label={'Limpiar'} onClick={handleLimpiar}></Button>
      </div>

      {
        resultado && (
          <>
          <Info text={'CRC:'} data={resultado.crc}/>
          <Info text={'Trama transmitida:'} data={resultado.tramaEnviar}/>
          <Info text={'Residuo comprobación:'} data={resultado.crc_comprobacion}/>
          <h2>Envío</h2>
          <Division pasos={resultado.pasos} />
          <h2>Comprobación</h2>
          <Division pasos={resultado.pasos_comprobacion} />
          </>
        )
      }
    </div>
  );
}

export default CRCPage;
