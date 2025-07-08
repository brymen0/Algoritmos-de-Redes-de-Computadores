import './Info.css'

export function Info ({text, data}) {
    return (
        <div className='info-container'>
            <span className='info-label'>{text}</span>
            <span className='info-data'>{data}</span>
        </div>
    )
}