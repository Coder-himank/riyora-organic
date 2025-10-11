
import React, { useEffect, useRef, useState, useCallback } from 'react'
import styles from '@/styles/InfinteScroller.module.css'

export default function InfiniteScroller({
    children,
    direction = 'left',
    speed = 60,
    cloneCount = 2,
    pauseOnHover = true,
}) {
    const containerRef = useRef(null)
    const stripRef = useRef(null)
    const rafRef = useRef(null)
    const lastTimeRef = useRef(null)
    const [isPaused, setIsPaused] = useState(false)
    const [dragging, setDragging] = useState(false)
    const dragState = useRef({ active: false, startX: 0, lastX: 0, velocity: 0 })
    const positionRef = useRef(0) // current translateX
    const contentWidthRef = useRef(0) // width of one set of children

    // Convert children into an array of item wrappers
    const childArray = React.Children.toArray(children)

    // Build duplicated sets (original + clones). We render cloneCount+1 sets total
    const sets = new Array(cloneCount + 1).fill(0)

    // Measure width of a single children set
    const measure = useCallback(() => {
        if (!stripRef.current || !containerRef.current) return
        // each set is wrapped in an element with data-set-index
        const firstSet = stripRef.current.querySelector('[data-set-index="0"]')
        if (!firstSet) return
        contentWidthRef.current = firstSet.getBoundingClientRect().width
    }, [])

    // Animation frame loop: move position according to speed and direction
    const animate = useCallback((time) => {
        if (lastTimeRef.current == null) lastTimeRef.current = time
        const dt = (time - lastTimeRef.current) / 1000 // seconds
        lastTimeRef.current = time

        if (!isPaused && !dragState.current.active) {
            const sign = direction === 'left' ? -1 : 1
            positionRef.current += sign * speed * dt
        } else if (dragState.current.active) {
            // while dragging, positionRef already updated by pointer events
            // we can also track velocity for a light inertial glide after release
            positionRef.current += dragState.current.velocity * dt
            // apply small friction to velocity so it slows down
            dragState.current.velocity *= 0.95
        }

        // Keep position within bounds by wrapping using contentWidth
        const cw = contentWidthRef.current || 0
        if (cw > 0) {
            // normalize position to range [ -cw, 0 ) if direction left, else (0, cw]
            if (direction === 'left') {
                if (positionRef.current <= -cw) positionRef.current += cw
                if (positionRef.current > 0) positionRef.current -= cw
            } else {
                if (positionRef.current >= cw) positionRef.current -= cw
                if (positionRef.current < 0) positionRef.current += cw
            }
        }

        // apply transform
        if (stripRef.current) {
            stripRef.current.style.transform = `translateX(${positionRef.current}px)`
        }

        rafRef.current = requestAnimationFrame(animate)
    }, [direction, isPaused, speed])

    useEffect(() => {
        measure()
        // ensure position starts at 0
        positionRef.current = 0

        // re-measure on resize
        const obs = new ResizeObserver(() => {
            measure()
        })
        if (containerRef.current) obs.observe(containerRef.current)

        rafRef.current = requestAnimationFrame(animate)
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            obs.disconnect()
        }
    }, [animate, measure])

    // Pointer / drag handling for "hand gestures"
    useEffect(() => {
        const c = containerRef.current
        if (!c) return

        function onPointerDown(e) {
            c.setPointerCapture(e.pointerId)
            dragState.current.active = true
            dragState.current.startX = e.clientX
            dragState.current.lastX = e.clientX
            dragState.current.velocity = 0
            setDragging(true)
            setIsPaused(true)
            lastTimeRef.current = null
        }

        function onPointerMove(e) {
            if (!dragState.current.active) return
            const dx = e.clientX - dragState.current.lastX
            dragState.current.lastX = e.clientX
            // update position directly
            positionRef.current += dx
            // store some velocity for inertia
            dragState.current.velocity = dx / (1 / 60) // approx pixels per second
        }

        function endDrag(e) {
            if (!dragState.current.active) return
            dragState.current.active = false
            setDragging(false)
            setIsPaused(false)
            // keep lastTimeRef null so animate continues smoothly
            lastTimeRef.current = null
        }

        c.addEventListener('pointerdown', onPointerDown)
        window.addEventListener('pointermove', onPointerMove)
        window.addEventListener('pointerup', endDrag)
        window.addEventListener('pointercancel', endDrag)

        return () => {
            c.removeEventListener('pointerdown', onPointerDown)
            window.removeEventListener('pointermove', onPointerMove)
            window.removeEventListener('pointerup', endDrag)
            window.removeEventListener('pointercancel', endDrag)
        }
    }, [])

    // Pause on hover
    const onMouseEnter = () => { if (pauseOnHover) setIsPaused(true) }
    const onMouseLeave = () => { if (pauseOnHover && !dragging) setIsPaused(false) }

    return (
        <div
            className={styles.container}
            ref={containerRef}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            aria-hidden={false}
        >
            <div className={styles.strip} ref={stripRef}>
                {sets.map((_, setIndex) => (
                    // each set is the same children repeated; indexing allows measurement
                    <div className={styles.set} data-set-index={setIndex} key={setIndex}>
                        {childArray.map((child, i) => (
                            <div className={styles.item} key={`${setIndex}-${i}`}>
                                {child}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Controls for accessibility: left / right buttons (optional) */}
            <div className={styles.controls}>
                <button
                    className={styles.btn}
                    onClick={() => { positionRef.current += 200 }}
                    aria-label="Scroll backward"
                >◀</button>
                <button
                    className={styles.btn}
                    onClick={() => { positionRef.current -= 200 }}
                    aria-label="Scroll forward"
                >▶</button>
            </div>
        </div>
    )
}


