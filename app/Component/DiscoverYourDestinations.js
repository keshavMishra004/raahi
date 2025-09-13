"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import "../css/discoverYourDestinations.css"

function DiscoverYourDestinations() {
  const containerRef = useRef(null)
  const svgRef = useRef(null)

  const [svgLoaded, setSvgLoaded] = useState(false)
  const [defaultViewBox, setDefaultViewBox] = useState(null)
  const defaultVBRef = useRef(null)

  const [allStates, setAllStates] = useState([])
  const [selectedState, setSelectedState] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Placeholder categories (adjust to your taxonomy)
  const CATEGORIES = [
    'All',
    'Aerial Activities',
    'Charters',
    'Water Sports',
    'Adventure',
    'Cultural',
    'Wildlife',
  ]

  // Placeholder DB: Map of State -> Services (replace with real data or API)
  const SERVICES_DB = {
    'Goa': [
      { name: 'Parasailing - Calangute', category: 'Aerial Activities', location: 'Calangute' },
      { name: 'Private Yacht Charter', category: 'Charters', location: 'Panaji' },
      { name: 'Jet Skiing - Baga', category: 'Water Sports', location: 'Baga' },
    ],
    'Maharashtra': [
      { name: 'Helicopter Joyride - Mumbai', category: 'Aerial Activities', location: 'Mumbai' },
      { name: 'Private Seaplane Charter', category: 'Charters', location: 'Mumbai' },
      { name: 'Kundalika River Rafting', category: 'Adventure', location: 'Kolad' },
    ],
    'Rajasthan': [
      { name: 'Hot Air Balloon - Jaipur', category: 'Aerial Activities', location: 'Jaipur' },
      { name: 'Desert Safari - Jaisalmer', category: 'Adventure', location: 'Jaisalmer' },
      { name: 'Heritage Walk - Udaipur', category: 'Cultural', location: 'Udaipur' },
    ],
    'Delhi': [
      { name: 'Helicopter City Tour', category: 'Aerial Activities' },
      { name: 'Luxury Limo Charter', category: 'Charters' },
      { name: 'Heritage Food Walk', category: 'Cultural' },
    ],
    'Uttar Pradesh': [
      { name: 'Ganga Aarti Cruise', category: 'Charters', location: 'Varanasi' },
      { name: 'Wildlife Safari - Dudhwa', category: 'Wildlife' },
      { name: 'Agra Heritage Tour', category: 'Cultural', location: 'Agra' },
    ],
    // ...add more states as needed
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/maps/in.svg', { cache: 'force-cache' })
        const text = await res.text()
        if (cancelled) return
        if (containerRef.current) {
          containerRef.current.innerHTML = text
          const svg = containerRef.current.querySelector('svg')
          if (svg) {
            svgRef.current = svg
            const vb = svg.getAttribute('viewBox')
            setDefaultViewBox(vb)
            defaultVBRef.current = parseViewBoxStr(vb)
            wireUpSVG(svg)
            setSvgLoaded(true)
          }
        }
      } catch (e) {
        console.error('Failed to load SVG /maps/in.svg', e)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const categories = useMemo(() => {
    const set = new Set(['All', ...CATEGORIES])
    Object.values(SERVICES_DB).flat().forEach(s => set.add(s.category))
    return Array.from(set)
  }, [])

  const services = useMemo(() => {
    if (!selectedState) return []
    const items = SERVICES_DB[selectedState] || []
    if (selectedCategory === 'All') return items
    return items.filter(s => s.category === selectedCategory)
  }, [selectedState, selectedCategory])

  function wireUpSVG(svg) {
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
    svg.style.width = '100%'
    svg.style.height = '100%'
    svg.style.display = 'block'

    const paths = Array.from(svg.querySelectorAll('path'))
    const names = new Set()
    paths.forEach(p => {
      const titleChild = p.querySelector('title')
      const fromChild = titleChild ? titleChild.textContent : ''
      const title =
        p.getAttribute('title') ||
        p.getAttribute('name') ||
        p.getAttribute('data-name') ||
        p.id ||
        fromChild ||
        ''
      const stateName = normalizeStateName(title)
      if (!stateName) return

      p.dataset.name = stateName
      names.add(stateName)
      p.style.cursor = 'pointer'
      if (!p.dataset.origFill) {
        const origFill = p.getAttribute('fill') || ''
        p.dataset.origFill = origFill
      }
      p.addEventListener('click', () => onSelectState(stateName, p))
      p.addEventListener('mouseenter', () => p.setAttribute('opacity', '0.9'))
      p.addEventListener('mouseleave', () => p.removeAttribute('opacity'))
    })

    setAllStates(Array.from(names).sort((a, b) => a.localeCompare(b)))
  }

  function normalizeStateName(raw) {
    if (!raw) return ''
    const cleaned = raw.replace(/^IN[-_]/i, '').replace(/_/g, ' ').trim()
    if (cleaned && cleaned === cleaned.toUpperCase()) {
      return cleaned
        .toLowerCase()
        .split(' ')
        .map(s => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ')
    }
    return cleaned
  }

  function onSelectState(stateName, pathEl) {
    setSelectedState(stateName)
    highlightState(stateName)
    if (pathEl) {
      zoomToPath(pathEl)
    } else {
      const svg = svgRef.current
      if (!svg) return
      const candidate = svg.querySelector(`path[data-name="${cssEscape(stateName)}"]`)
      if (candidate) zoomToPath(candidate)
    }
  }

  // Zoom helpers
  function parseViewBoxStr(str) {
    if (!str) return null
    const [x, y, w, h] = str.split(/\s+|,/).map(Number)
    return { x, y, w, h }
  }
  function getCurrentVB() {
    const svg = svgRef.current
    if (!svg) return null
    return parseViewBoxStr(svg.getAttribute('viewBox'))
  }
  function setVB({ x, y, w, h }) {
    const svg = svgRef.current
    if (!svg) return
    svg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`)
  }
  function clampToDefault(vb) {
    const def = defaultVBRef.current
    if (!def) return vb
    const w = Math.min(vb.w, def.w)
    const h = Math.min(vb.h, def.h)
    const xMin = def.x
    const yMin = def.y
    const xMax = def.x + def.w - w
    const yMax = def.y + def.h - h
    return {
      w, h,
      x: Math.min(Math.max(vb.x, xMin), xMax),
      y: Math.min(Math.max(vb.y, yMin), yMax),
    }
  }
  function zoomBy(factor) {
    const vb = getCurrentVB()
    if (!vb) return
    const cx = vb.x + vb.w / 2
    const cy = vb.y + vb.h / 2
    const newW = vb.w * factor
    const newH = vb.h * factor
    const next = clampToDefault({
      x: cx - newW / 2,
      y: cy - newH / 2,
      w: newW,
      h: newH,
    })
    setVB(next)
  }
  function zoomIn() { zoomBy(0.8) }
  function zoomOut() { zoomBy(1.25) }

  function zoomToPath(path) {
    const svg = svgRef.current
    if (!svg) return
    const bbox = path.getBBox()
    const pad = Math.max(bbox.width, bbox.height) * 0.2
    const x = bbox.x - pad
    const y = bbox.y - pad
    const w = bbox.width + pad * 2
    const h = bbox.height + pad * 2
    setVB(clampToDefault({ x, y, w, h }))
  }

  function resetZoom() {
    const svg = svgRef.current
    if (svg && defaultViewBox) {
      svg.setAttribute('viewBox', defaultViewBox)
    }
  }

  function highlightState(stateName) {
    const svg = svgRef.current
    if (!svg) return
    const paths = Array.from(svg.querySelectorAll('path'))
    paths.forEach(p => {
      const isSelected = p.dataset.name === stateName
      if (isSelected) {
        p.setAttribute('stroke', '#1f2937')
        p.setAttribute('stroke-width', '1.5')
        p.setAttribute('fill', '#fde68a')
      } else {
        p.setAttribute('stroke', '#4b5563')
        p.setAttribute('stroke-width', '0.5')
        const orig = p.dataset.origFill || '#e5e7eb'
        p.setAttribute('fill', orig)
      }
    })
  }

  function cssEscape(value) {
    return value.replace(/["\\]/g, '\\$&')
  }

  function handleStateChange(e) {
    const stateName = e.target.value
    if (!stateName) {
      setSelectedState('')
      resetZoom()
      highlightState('')
      return
    }
    onSelectState(stateName)
  }

  function handleCategoryChange(e) {
    setSelectedCategory(e.target.value)
  }

  return (
    <section className="discover-your-dest">
      <h3 className="section-title hero">DISCOVER YOUR DESTINATION</h3>
      <div className='dest-card'>
        <div className='locations-div'>
          <h4 className='locations-head'>Locations:</h4>
          {/* services cards dynamically fetched */}
          <div className='service-card'>
            <h5 className='service-title'>SKY HIGH - NANRAUL</h5>
            <p>⭐⭐⭐⭐⭐ 4.9</p>
            <p className='service-location'>Narnaul, Pune</p>
          </div>
          <div className='service-card'>
            <h5 className='service-title'>SKY HIGH - NANRAUL</h5>
            <p>⭐⭐⭐ 3.2</p>
            <p className='service-location'>Narnaul, Pune</p>
          </div>
        </div>
        <div className='map-div'>
          
        </div>
        <div className='options-div'>
          <div className='select-options'>
            <select className="map-options" value={selectedState} onChange={handleStateChange}>
              <option value="">Select a State</option>
              {allStates.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              className="map-options"
              value={selectedCategory}
              onChange={handleCategoryChange}
              disabled={!selectedState}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className='zoom-options'>
            <button type="button" className="zoom-btn" onClick={zoomIn}>+</button>
            <button type="button" className="zoom-btn" onClick={zoomOut}>−</button>
          </div>
        </div>
      </div>


      <div className="discover-card">
        <div className="discover-grid">
          <div className="left-panel left-panel--with-divider">
            <div className="panel locations">
              <div className="locations-header">
                <h3 className="locations-title">Locations:</h3>
                {selectedState ? <span className="state-chip">{selectedState}</span> : null}
              </div>

              {!selectedState && (
                <p className="muted">Select a state to view available services.</p>
              )}

              {selectedState && services.length === 0 && (
                <p className="muted">No services found for this category. Try another filter.</p>
              )}

              {selectedState && services.length > 0 && (
                <ul className="locations-list">
                  {services.map((svc, idx) => (
                    <li key={idx} className="location-item">
                      <span className="location-name">{svc.name}</span>
                      <span className="location-meta">
                        {svc.category}{svc.location ? ` • ${svc.location}` : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="map-panel">
            {!svgLoaded && <div className="map-loading">Loading map...</div>}
            <div ref={containerRef} className="map-container" />

            {/* Top-right overlay controls */}
            <div className="map-controls">
              <div className="control">
                <select className="select select--pill" value={selectedState} onChange={handleStateChange}>
                  <option value="">Select a State</option>
                  {allStates.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="control">
                <select
                  className="select select--pill"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  disabled={!selectedState}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            {/* Bottom-right zoom controls */}
            <div className="zoom-controls">
              <button type="button" className="zoom-btn" onClick={zoomIn}>+</button>
              <button type="button" className="zoom-btn" onClick={zoomOut}>−</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DiscoverYourDestinations