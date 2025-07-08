function xor(a, b) {
  return a.slice(1).map((val, i) => val ^ b[i + 1]);
}

function division(dividend, divisor) {
  let steps = []; // Para guardar la visualización
  let indice = divisor.length;
  let CRC = dividend.slice(0, indice);

  while (indice < dividend.length) {
    let divisorActual = CRC[0] === 1 ? divisor : Array(CRC.length).fill(0);
    let resultadoXor = xor(divisorActual, CRC);
    
    steps.push({
      dividendo: [...CRC],
      divisor: divisorActual,
      resultado: resultadoXor,
      bitSiguiente: dividend[indice],
    });

    CRC = [...resultadoXor, dividend[indice]];
    indice += 1;
  }

  // Último paso sin bit siguiente
  let divisorFinal = CRC[0] === 1 ? divisor : Array(CRC.length).fill(0);
  let resultadoFinal = xor(divisorFinal, CRC);
  steps.push({
    dividendo: [...CRC],
    divisor: divisorFinal,
    resultado: resultadoFinal,
    bitSiguiente: null,
  });

  return { crc: resultadoFinal, pasos: steps };
}

export function generateTrama(mensaje, generador) {
  const mensajeExtendido = [...mensaje, ...Array(generador.length - 1).fill(0)];
  const { crc, pasos } = division(mensajeExtendido, generador);
  const tramaEnviar = [...mensaje, ...crc];
  const { crc: crc_comprobacion, pasos: pasos_comprobacion } = division(tramaEnviar, generador);

  return { crc, tramaEnviar, crc_comprobacion, pasos, pasos_comprobacion };
}
