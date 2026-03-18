import { useState } from 'react'

const ratios = {
    '16:9': 16 / 9,
    '1:1': 1,
    '5:4': 5 / 4,
    '9:16': 9 / 16,
    '4:5': 4 / 5
}

export default function ExportUI({ onExport }) {
    const [selectedRatio, setSelectedRatio] = useState('16:9')
    const [isExporting, setIsExporting] = useState(false)

    const handleExport = async () => {
        setIsExporting(true)
        try {
            await onExport(selectedRatio, ratios[selectedRatio])
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            zIndex: 30,
            display: 'flex',
            gap: '10px',
            background: 'rgba(0,0,0,0.8)',
            padding: '10px',
            borderRadius: '8px'
        }}>
            <select
                value={selectedRatio}
                onChange={(e) => setSelectedRatio(e.target.value)}
                style={{ padding: '5px', borderRadius: '4px', background: '#333', color: 'white', border: 'none' }}
            >
                {Object.keys(ratios).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <button
                onClick={handleExport}
                disabled={isExporting}
                style={{
                    padding: '5px 15px',
                    borderRadius: '4px',
                    background: isExporting ? '#555' : '#007bff',
                    color: 'white',
                    border: 'none',
                    cursor: isExporting ? 'wait' : 'pointer'
                }}
            >
                {isExporting ? 'Exporting...' : 'Export PNG'}
            </button>
        </div>
    )
}
