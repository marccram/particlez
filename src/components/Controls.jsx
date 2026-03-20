import React from 'react'
import './Controls.css'
import { themes } from '../utils/themes'

const presets = {
    'Deep Ocean': {
        config: {
            count: 120,
            layout: 'scatter',
            spread: 12,
            theme: 'ocean',
            size: 0.4,
            sides: 32,
            opacity: 0.3,
            connectParticles: true,
            connectionDistance: 5,
            enableEffects: true
        },
        camera: [0, 5, 25]
    },
    'Cyberpunk': {
        config: {
            count: 80,
            layout: 'spiral',
            spread: 8,
            theme: 'neon',
            size: 0.6,
            sides: 4,
            opacity: 0.8,
            connectParticles: false,
            enableEffects: true
        },
        camera: [10, 5, 15]
    },
    'Minimalist': {
        config: {
            count: 20,
            layout: 'grid',
            spread: 4,
            theme: 'monochrome',
            size: 0.8,
            sides: 3,
            opacity: 0.15,
            connectParticles: true,
            connectionDistance: 6,
            enableEffects: false
        },
        camera: [0, 0, 20]
    },
    'Golden Hour': {
        config: {
            count: 40,
            layout: 'scatter',
            spread: 15,
            theme: 'sunset',
            size: 1.2,
            sides: 6,
            opacity: 0.4,
            connectParticles: false,
            enableEffects: true
        },
        camera: [-8, 4, 18]
    }
}

export default function Controls({ config, setConfig, setTargetCameraPos, onRandomize }) {
    const handleChange = (key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }))
    }

    const applyPreset = (presetName) => {
        const { config: presetConfig, camera: presetCamera } = presets[presetName]
        setConfig(prev => ({ ...prev, ...presetConfig }))
        setTargetCameraPos(presetCamera)
    }

    return (
        <div className="premium-controls">
            <div className="controls-header">
                <h2>Particlez</h2>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>v1.0</div>
            </div>

            <div className="control-section">
                <h3>Presets</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {Object.keys(presets).map(name => (
                        <button 
                            key={name}
                            className="preset-btn"
                            onClick={() => applyPreset(name)}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '6px',
                                color: 'white',
                                padding: '8px',
                                fontSize: '0.75rem',
                                cursor: 'pointer'
                            }}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="control-section">
                <h3>Scene</h3>
                <div className="control-group">
                    <div className="control-item">
                        <div className="control-label">
                            <span>Count</span>
                            <span className="control-value">{config.count}</span>
                        </div>
                        <input 
                            type="range" 
                            min="10" 
                            max="200" 
                            value={config.count} 
                            onChange={(e) => handleChange('count', parseInt(e.target.value))} 
                        />
                    </div>

                    <div className="control-item">
                        <div className="control-label">Layout</div>
                        <select value={config.layout} onChange={(e) => handleChange('layout', e.target.value)}>
                            <option value="grid">Grid</option>
                            <option value="scatter">Scatter</option>
                            <option value="spiral">Spiral</option>
                        </select>
                    </div>

                    <div className="control-item">
                        <div className="control-label">
                            <span>Spread</span>
                            <span className="control-value">{config.spread}</span>
                        </div>
                        <input 
                            type="range" 
                            min="1" 
                            max="20" 
                            step="0.5"
                            value={config.spread} 
                            onChange={(e) => handleChange('spread', parseFloat(e.target.value))} 
                        />
                    </div>
                </div>
            </div>

            <div className="control-section">
                <h3>Geometry</h3>
                <div className="control-group">
                    <div className="control-item">
                        <div className="control-label">
                            <span>Size</span>
                            <span className="control-value">{config.size}</span>
                        </div>
                        <input 
                            type="range" 
                            min="0.1" 
                            max="2" 
                            step="0.1"
                            value={config.size} 
                            onChange={(e) => handleChange('size', parseFloat(e.target.value))} 
                        />
                    </div>

                    <div className="control-item">
                        <div className="control-label">
                            <span>Sides</span>
                            <span className="control-value">{config.sides}</span>
                        </div>
                        <input 
                            type="range" 
                            min="3" 
                            max="64" 
                            value={config.sides} 
                            onChange={(e) => handleChange('sides', parseInt(e.target.value))} 
                        />
                    </div>

                    <div className="control-item">
                        <div className="control-label">
                            <span>Opacity</span>
                            <span className="control-value">{config.opacity}</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.05"
                            value={config.opacity} 
                            onChange={(e) => handleChange('opacity', parseFloat(e.target.value))} 
                        />
                    </div>
                </div>
            </div>

            <div className="control-section">
                <h3>Connections</h3>
                <div className="control-group">
                    <div className="checkbox-item">
                        <span>Show Connections</span>
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                checked={config.connectParticles} 
                                onChange={(e) => handleChange('connectParticles', e.target.checked)} 
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    {config.connectParticles && (
                        <>
                            <div className="control-item">
                                <div className="control-label">
                                    <span>Distance</span>
                                    <span className="control-value">{config.connectionDistance}</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="15" 
                                    step="0.5"
                                    value={config.connectionDistance} 
                                    onChange={(e) => handleChange('connectionDistance', parseFloat(e.target.value))} 
                                />
                            </div>
                            <div className="control-item">
                                <div className="control-label">
                                    <span>Intensity</span>
                                    <span className="control-value">{config.connectorOpacity}</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="1" 
                                    step="0.05"
                                    value={config.connectorOpacity} 
                                    onChange={(e) => handleChange('connectorOpacity', parseFloat(e.target.value))} 
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="control-section">
                <h3>Post-Processing</h3>
                <div className="control-group">
                    <div className="checkbox-item">
                        <span>Enable Effects</span>
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                checked={config.enableEffects} 
                                onChange={(e) => handleChange('enableEffects', e.target.checked)} 
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            <button className="random-btn" onClick={onRandomize}>
                Randomize Scene
            </button>
        </div>
    )
}
