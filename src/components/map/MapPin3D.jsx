import React from 'react'
import { divIcon } from 'leaflet'
import { renderToStaticMarkup } from 'react-dom/server'
import { FiCheckCircle, FiXCircle } from 'react-icons/fi'

// Renders a "floating" pin with a drop shadow + slight lift to read as 3D,
// colored green (eligible) or red/grey (not eligible).
function PinShape({ eligible }) {
  const Icon = eligible ? FiCheckCircle : FiXCircle
  const color = eligible ? '#0B6E4F' : '#C0392B'
  return (
    <div style={{ filter: 'drop-shadow(0 6px 6px rgba(0,0,0,0.35))' }}>
      <div
        style={{
          width: 34, height: 34, borderRadius: '50% 50% 50% 0', background: color,
          transform: 'rotate(-45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        <div style={{ transform: 'rotate(45deg)', color: 'white' }}>
          <Icon size={16} />
        </div>
      </div>
    </div>
  )
}

export function buildPinIcon(eligible) {
  return divIcon({
    html: renderToStaticMarkup(<PinShape eligible={eligible} />),
    className: '',
    iconSize: [34, 34],
    iconAnchor: [17, 34]
  })
}
