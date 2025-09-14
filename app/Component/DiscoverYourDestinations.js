"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import "../css/discoverYourDestinations.css"

function DiscoverYourDestinations() {
  // Small map refs
  const containerRef = useRef(null)
  const svgRef = useRef(null)

  const [svgLoaded, setSvgLoaded] = useState(false)

  // Track default viewBox for the single SVG
  const defaultVBStrRef = useRef(null) // string
  const defaultVBRef = useRef(null)    // {x,y,w,h}

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
      { name: 'Falana Falana Trek', category: 'Pilgrim', location: 'Prayagraj' }
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
            defaultVBStrRef.current = vb
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

    // --- Inject gradient into <defs> if not present ---
    let defs = svg.querySelector('defs')
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
      svg.insertBefore(defs, svg.firstChild)
    }
    // Remove any previous gradient with this id
    const oldGrad = defs.querySelector('#paint0_linear_893_4441')
    if (oldGrad) oldGrad.remove()
    // Add the gradient
    const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient')
    grad.setAttribute('id', 'paint0_linear_893_4441')
    grad.setAttribute('x1', '0')
    grad.setAttribute('y1', '0')
    grad.setAttribute('x2', '0')
    grad.setAttribute('y2', '1')
    grad.setAttribute('gradientUnits', 'objectBoundingBox')
    // Use objectBoundingBox for relative gradient on each path
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    stop1.setAttribute('offset', '0%')
    stop1.setAttribute('stop-color', 'white')
    grad.appendChild(stop1)
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    stop2.setAttribute('offset', '100%')
    stop2.setAttribute('stop-color', '#DFFEFF')
    grad.appendChild(stop2)
    defs.appendChild(grad)

    // Set all paths to use the gradient fill and default stroke
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
      // Set default fill/stroke/stroke-width for each path
      p.setAttribute('fill', 'url(#paint0_linear_893_4441)')
      p.setAttribute('stroke', '#4A9BD4')
      p.setAttribute('stroke-width', '2.5')
      if (!p.dataset.origFill) {
        p.dataset.origFill = 'url(#paint0_linear_893_4441)'
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

  // Single-map helpers
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

  // Animate viewBox from current to target over duration (ms)
  function animateViewBox(target, duration = 400) {
    const svg = svgRef.current
    if (!svg) return
    const startVB = getCurrentVB()
    if (!startVB) return

    const startTime = performance.now()
    const diff = {
      x: target.x - startVB.x,
      y: target.y - startVB.y,
      w: target.w - startVB.w,
      h: target.h - startVB.h,
    }

    function step(now) {
      const elapsed = Math.min((now - startTime) / duration, 1)
      const ease = elapsed < 1 ? 1 - Math.pow(1 - elapsed, 2) : 1 // easeOutQuad
      const next = {
        x: startVB.x + diff.x * ease,
        y: startVB.y + diff.y * ease,
        w: startVB.w + diff.w * ease,
        h: startVB.h + diff.h * ease,
      }
      setVB(next)
      if (elapsed < 1) {
        requestAnimationFrame(step)
      } else {
        setVB(target)
      }
    }
    requestAnimationFrame(step)
  }

  function zoomToPath(path) {
    const svg = svgRef.current
    if (!svg) return
    const bbox = path.getBBox()
    const pad = Math.max(bbox.width, bbox.height) * 0.2
    const x = bbox.x - pad
    const y = bbox.y - pad
    const w = bbox.width + pad * 2
    const h = bbox.height + pad * 2
    const target = clampToDefault({ x, y, w, h })
    animateViewBox(target)
  }

  function resetZoom() {
    const svg = svgRef.current
    if (svg && defaultVBStrRef.current) {
      const target = parseViewBoxStr(defaultVBStrRef.current)
      animateViewBox(target)
    }
  }

  function highlightState(stateName) {
    const svg = svgRef.current
    if (!svg) return
    const paths = Array.from(svg.querySelectorAll('path'))
    paths.forEach(p => {
      const isSelected = p.dataset.name === stateName
      if (isSelected) {
        p.setAttribute('stroke', '#FF7125')
        p.setAttribute('stroke-width', '1.5')
        p.setAttribute('fill', '#ff712510')
      } else {
        // Restore gradient fill and default stroke for non-selected
        p.setAttribute('stroke', '#4A9BD4')
        p.setAttribute('stroke-width', '1')
        p.setAttribute('fill', 'url(#paint0_linear_893_4441)')
      }
    })
  }

  function cssEscape(value) {
    return value.replace(/["\\]/g, '\\$&')
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

      {/* Compact card with small map */}
      <div className='dest-card'>
        <div className='locations-div'>
          <h4 className='locations-head'>Locations:</h4>
          {/* dynamically fetched list of services/locations */}
          {selectedState && services.length > 0 && (
            services.map((srv, i) => (
              <div className="service-card" key={`${srv.name}-${i}`}>
                <h5 className='service-title'>{srv.name}</h5>
                <p>⭐⭐⭐ 3.2</p>
                <p className='service-location'>{srv.location || selectedState}</p>
              </div>
            ))
          )}
          {!selectedState && (
            <p className="muted">Select a state to view available services.</p>
          )}
          {selectedState && services.length === 0 && (
            <p className="muted">No services found for this category.</p>
          )}
        </div>

        {/* Map */}
        <div className='map-div'>
          {!svgLoaded && <div className="map-loading">Loading map...</div>}
          <div ref={containerRef} className="map-container" />
        </div>
        {/* options for map and services */}
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
    </section>
  )
}

export default DiscoverYourDestinations