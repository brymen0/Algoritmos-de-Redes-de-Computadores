import './TablaEnlaces.css';

function TablaEnlaces({ origen, enlaces }) {
    if (enlaces.length === 0) return null;

    return (
        <table className="tabla-enlaces">
            <thead>
                <tr>
                    <th colSpan="2">{origen}</th>
                </tr>
                <tr>
                <th>Destino</th>
                <th>Peso</th>
                </tr>
            </thead>
            <tbody>
                {enlaces.map((enlace, index) => (
                <tr key={index}>
                    <td>{enlace.destino}</td>
                    <td>{enlace.peso}</td>
                </tr>
                ))}
            </tbody>
        </table>
    );
}

export default TablaEnlaces;
