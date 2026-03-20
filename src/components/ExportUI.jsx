import { useState } from 'react'
import './ExportUI.css'

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
        <div className="export-ui">
            <select
                value={selectedRatio}
                onChange={(e) => setSelectedRatio(e.target.value)}
            >
                {Object.keys(ratios).map(r => (
                    <option key={r} value={r}>{r} Aspect</option>
                ))}
            </select>
            <button
                className="export-btn"
                onClick={handleExport}
                disabled={isExporting}
            >
                {isExporting ? 'Exporting...' : 'Export PNG'}
            </button>
        </div>
    )
}
