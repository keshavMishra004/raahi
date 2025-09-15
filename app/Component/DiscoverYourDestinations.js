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

  const [selectedState, setSelectedState] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Hardcoded list of states (simulate backend)
  const STATES = [
    'Goa',
    'Maharashtra',
    'Rajasthan',
    'Delhi',
    'Uttar Pradesh',
    // ...add more as needed
  ];

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
      { name: 'Parasailing - Calangute', category: 'Aerial Activities', location: 'Calangute', rating: 4.3 },
      { name: 'Private Yacht Charter', category: 'Charters', location: 'Panaji', rating: 3.9 },
      { name: 'Jet Skiing - Baga', category: 'Water Sports', location: 'Baga', rating: 2.7 },
    ],
    'Maharashtra': [
      { name: 'Helicopter Joyride - Mumbai', category: 'Aerial Activities', location: 'Mumbai', rating: 2.2 },
      { name: 'Private Seaplane Charter', category: 'Charters', location: 'Mumbai', rating: 4.7 },
      { name: 'Kundalika River Rafting', category: 'Adventure', location: 'Kolad', rating: 4.3 },
    ],
    'Rajasthan': [
      { name: 'Hot Air Balloon - Jaipur', category: 'Aerial Activities', location: 'Jaipur', rating: 3.5 },
      { name: 'Desert Safari - Jaisalmer', category: 'Adventure', location: 'Jaisalmer', rating: 3 },
      { name: 'Heritage Walk - Udaipur', category: 'Cultural', location: 'Udaipur', rating: 4.1 },
    ],
    'Delhi': [
      { name: 'Helicopter City Tour', category: 'Aerial Activities', rating: 2.3 },
      { name: 'Luxury Limo Charter', category: 'Charters', rating: 5 },
      { name: 'Heritage Food Walk', category: 'Cultural', rating: 3.8 },
    ],
    'Uttar Pradesh': [
      { name: 'Ganga Aarti Cruise', category: 'Charters', location: 'Varanasi', rating: 3.4 },
      { name: 'Wildlife Safari - Dudhwa', category: 'Wildlife', rating: 4 },
      { name: 'Agra Heritage Tour', category: 'Cultural', location: 'Agra', rating: 2.2 },
      { name: 'Falana Falana Trek', category: 'Pilgrim', location: 'Prayagraj', rating: 4.3 }
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
      p.setAttribute('stroke-width', '0.3%')
      if (!p.dataset.origFill) {
        p.dataset.origFill = 'url(#paint0_linear_893_4441)'
      }
      p.addEventListener('click', () => onSelectState(stateName, p))
      p.addEventListener('mouseenter', () => p.setAttribute('opacity', '0.9'))
      p.addEventListener('mouseleave', () => p.removeAttribute('opacity'))
    })

    // --- Add pin SVGs to states with services ---
    // Remove any previous pins
    Array.from(svg.querySelectorAll('.state-pin')).forEach(pin => pin.remove())

    // Pin colors (cycled)
    const pinColors = ['#42D4E2', '#FFC639', '#FF658E', '#FF983B']
    const serviceStates = Object.keys(SERVICES_DB)

    // Helper to add pins (used initially and after zoom)
    function addPins() {
      // Remove old pins
      Array.from(svg.querySelectorAll('.state-pin')).forEach(pin => pin.remove())
      serviceStates.forEach((state, idx) => {
        const path = Array.from(svg.querySelectorAll('path')).find(p => p.dataset.name === state)
        if (!path) return
        // Calculate centroid of the path
        const centroid = getPathCentroid(path)
        const cx = centroid.x
        const cy = centroid.y
        const color = pinColors[idx % pinColors.length]
        // Use a <g> with transform for pin placement and scaling
        const vb = svg.viewBox.baseVal || { width: 100, height: 100 }
        const svgWidth = vb.width || 100
        // Pin width as 6% of SVG width
        const pinWidth = svgWidth * 0.06
        const pinHeight = pinWidth * (21 / 14)
        const scale = pinWidth / 14
        const pinGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        pinGroup.setAttribute('class', 'state-pin')
        pinGroup.setAttribute('pointer-events', 'none')
        // Center the pin at (cx, cy) by translating and scaling
        pinGroup.setAttribute(
          'transform',
          `translate(${cx - pinWidth / 2},${cy - pinHeight}) scale(${scale})`
        )
        const pinPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        pinPath.setAttribute('d', 'M7 17.6592C4.65 15.9194 2.89567 14.2298 1.737 12.5905C0.579 10.9511 0 9.34514 0 7.77267C0 6.58496 0.212667 5.54345 0.638 4.64814C1.06267 3.75351 1.60833 3.00508 2.275 2.40286C2.94167 1.80064 3.69167 1.34897 4.525 1.04786C5.35833 0.746747 6.18333 0.596191 7 0.596191C7.81667 0.596191 8.64167 0.746747 9.475 1.04786C10.3083 1.34897 11.0583 1.80064 11.725 2.40286C12.3917 3.00508 12.9377 3.75351 13.363 4.64814C13.7877 5.54345 14 6.58496 14 7.77267C14 9.34514 13.4207 10.9511 12.262 12.5905C11.104 14.2298 9.35 15.9194 7 17.6592ZM7 9.62953C7.55 9.62953 8.021 9.4328 8.413 9.03935C8.80434 8.64656 9 8.17415 9 7.62212C9 7.07008 8.80434 6.59734 8.413 6.20388C8.021 5.8111 7.55 5.61471 7 5.61471C6.45 5.61471 5.97933 5.8111 5.588 6.20388C5.196 6.59734 5 7.07008 5 7.62212C5 8.17415 5.196 8.64656 5.588 9.03935C5.97933 9.4328 6.45 9.62953 7 9.62953ZM0 20.6703L0 18.6629H14V20.6703H0Z')
        pinPath.setAttribute('fill', color)
        pinPath.setAttribute('stroke-width', 0)
        pinGroup.appendChild(pinPath)
        svg.appendChild(pinGroup)
      })
    }

    addPins()

    // Patch zoomBy, zoomIn, zoomOut, animateViewBox, and resetZoom to re-add pins after zoom/pan
    svg._addPins = addPins // attach for use in other functions
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
    // Use a faster duration for zoom in/out
    animateViewBox(next, 180)
    setIsZoomed(true)
  }
  function zoomIn() { zoomBy(0.8) }
  function zoomOut() { zoomBy(1.25) }

  // Animate viewBox from current to target over duration (ms)
  // Make zooming faster and snappier (duration = 180ms for zoom, 400ms for state select/reset)
  function animateViewBox(target, duration = 400) {
    const svg = svgRef.current
    if (!svg) return
    const startVB = getCurrentVB()
    if (!startVB) return

    // Check if target is default viewBox
    const isDefault =
      defaultVBStrRef.current &&
      `${target.x} ${target.y} ${target.w} ${target.h}` === defaultVBStrRef.current;
    setIsZoomed(!isDefault);

    const startTime = performance.now()
    const diff = {
      x: target.x - startVB.x,
      y: target.y - startVB.y,
      w: target.w - startVB.w,
      h: target.h - startVB.h,
    }

    function step(now) {
      const elapsed = Math.min((now - startTime) / duration, 1)
      // Use a slightly more aggressive ease for snappier feel
      const ease = elapsed < 1 ? 1 - Math.pow(1 - elapsed, 2.5) : 1
      const next = {
        x: startVB.x + diff.x * ease,
        y: startVB.y + diff.y * ease,
        w: startVB.w + diff.w * ease,
        h: startVB.h + diff.h * ease,
      }
      setVB(next)
      if (svg._addPins) svg._addPins() // <-- re-add pins after viewBox change
      if (elapsed < 1) {
        requestAnimationFrame(step)
      } else {
        setVB(target)
        if (svg._addPins) svg._addPins()
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
        p.setAttribute('stroke-width', '0.3%')
        p.setAttribute('fill', '#ff712510')
      } else {
        // Restore gradient fill and default stroke for non-selected
        p.setAttribute('stroke', '#4A9BD4')
        p.setAttribute('stroke-width', '0.3%')
        // Only set fill if not already highlighted
        if (p.getAttribute('fill') !== '#ff712510') {
          p.setAttribute('fill', 'url(#paint0_linear_893_4441)')
        }
      }
    })
    // Ensure pin colors are not affected by highlight
    Array.from(svg.querySelectorAll('.state-pin path')).forEach((pinPath, idx) => {
      const pinColors = ['#42D4E2', '#FFC639', '#FF658E', '#FF983B']
      pinPath.setAttribute('fill', pinColors[idx % pinColors.length])
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

  function handleReset() {
    setSelectedState('')
    setSelectedCategory('All')
    setTimeout(() => {
      const svg = svgRef.current
      if (svg && defaultVBStrRef.current) {
        const target = parseViewBoxStr(defaultVBStrRef.current)
        animateViewBox(target, 400) // keep reset smooth and a bit slower
        setIsZoomed(false)
      }
      highlightState('')
    }, 0)
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
            services.map((srv, i) => {
              // Dynamic stars based on rating (show half star if needed)
              const rating = srv.rating || 0;
              const fullStars = Math.round(rating);
              const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
              const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
              return (
                <div className="service-card" key={`${srv.name}-${i}`}>
                  <h5 className='service-title'>{srv.name}</h5>
                  <p>
                    {Array(fullStars).fill().map((_, idx) => <span className='star' key={`f${idx}`}>★</span>)}
                    {hasHalfStar ? <span className='star' key="half">⯨</span> : null}
                    {Array(emptyStars).fill().map((_, idx) => <span className='star' key={`e${idx}`}>☆</span>)}
                    <span className='rating'>{srv.rating}</span>
                  </p>
                  <p className='service-location'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                      <path d="M8.00065 15.1666C7.8451 15.1666 7.71176 15.1221 7.60065 15.0333C7.48954 14.9444 7.40621 14.8277 7.35065 14.6833C7.13954 14.061 6.87287 13.4777 6.55065 12.9333C6.23954 12.3888 5.80065 11.7499 5.23398 11.0166C4.66732 10.2833 4.20621 9.58325 3.85065 8.91658C3.50621 8.24992 3.33398 7.44436 3.33398 6.49992C3.33398 5.19992 3.78398 4.09992 4.68398 3.19992C5.5951 2.28881 6.70065 1.83325 8.00065 1.83325C9.30065 1.83325 10.4007 2.28881 11.3007 3.19992C12.2118 4.09992 12.6673 5.19992 12.6673 6.49992C12.6673 7.51103 12.4729 8.35547 12.084 9.03325C11.7062 9.69992 11.2673 10.361 10.7673 11.0166C10.1673 11.8166 9.71176 12.4833 9.40065 13.0166C9.10065 13.5388 8.85065 14.0944 8.65065 14.6833C8.5951 14.8388 8.50621 14.961 8.38399 15.0499C8.27287 15.1277 8.1451 15.1666 8.00065 15.1666ZM8.00065 8.16658C8.46732 8.16658 8.86176 8.00547 9.18398 7.68325C9.50621 7.36103 9.66732 6.96658 9.66732 6.49992C9.66732 6.03325 9.50621 5.63881 9.18398 5.31658C8.86176 4.99436 8.46732 4.83325 8.00065 4.83325C7.53398 4.83325 7.13954 4.99436 6.81732 5.31658C6.4951 5.63881 6.33398 6.03325 6.33398 6.49992C6.33398 6.96658 6.4951 7.36103 6.81732 7.68325C7.13954 8.00547 7.53398 8.16658 8.00065 8.16658Z" fill="#FF7125"/>
                    </svg>{srv.location || selectedState}
                  </p>
                </div>
              );
            })
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
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
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
            <button
              type="button"
              className="reset-btn"
              onClick={handleReset}
              disabled={!selectedState && !isZoomed}
            >
              Reset
            </button>
            <button type="button" className="zoom-btn" onClick={zoomIn}>+</button>
            <button type="button" className="zoom-btn" onClick={zoomOut}>−</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DiscoverYourDestinations

// Helper to calculate centroid of a path
function getPathCentroid(path) {
  try {
    const length = path.getTotalLength()
    let points = []
    // Sample points along the path
    for (let i = 0; i < length; i += Math.max(1, length / 100)) {
      const pt = path.getPointAtLength(i)
      points.push([pt.x, pt.y])
    }
    // Calculate average x and y
    const n = points.length
    const sum = points.reduce((acc, p) => [acc[0] + p[0], acc[1] + p[1]], [0, 0])
    return { x: sum[0] / n, y: sum[1] / n }
  } catch {
    // fallback to bbox center
    const bbox = path.getBBox()
    return { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 }
  }
}