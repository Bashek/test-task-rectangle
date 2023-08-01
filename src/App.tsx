import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Description } from './components/Description';

import { Coords } from './types/types'

function App () {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const [maxX, setMaxX] = useState(0);
  const [maxY, setMaxY] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const isClicked = useRef(false);

  const coords = useRef<Coords>({ startX: 0, startY: 0, lastX: 0, lastY: 0 });

  const updateMaxPositions = useCallback(() => {
    if (containerRef.current && boxRef.current) {
      const { width: containerWidth, height: containerHeight } = containerRef.current.getBoundingClientRect();
      const { width: boxWidth, height: boxHeight } = boxRef.current.getBoundingClientRect();

      setMaxX(containerWidth - boxWidth + boxWidth / 2);
      setMaxY(containerHeight - boxHeight + boxHeight / 2);
      setContainerWidth(containerWidth);
      setContainerHeight(containerHeight);

      const clampedX = Math.min(Math.max(coords.current.lastX, (boxWidth / 2)), containerWidth - (boxWidth / 2));
      const clampedY = Math.min(Math.max(coords.current.lastY, (boxHeight / 2)), containerHeight - (boxHeight / 2));

      const boxStyle = boxRef.current.style;
      boxStyle.left = `${clampedX}px`;
      boxStyle.top = `${clampedY}px`;

      coords.current = {
        ...coords.current,
        lastX: clampedX,
        lastY: clampedY,
      };
    }
  }, []);

  const onMouseDown = useCallback((e: MouseEvent) => {
    isClicked.current = true;
    const { clientX, clientY } = e;
    const { offsetLeft, offsetTop } = boxRef.current!;
    coords.current = {
      startX: clientX,
      startY: clientY,
      lastX: offsetLeft || 0,
      lastY: offsetTop || 0,
    };
  }, []);

  const onMouseUp = useCallback(() => {
    isClicked.current = false;
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isClicked.current) return;

    const { clientX, clientY } = e;
    const { startX, startY, lastX, lastY } = coords.current;

    const nextX = clientX - startX + lastX;
    const nextY = clientY - startY + lastY;

    const clampedX = Math.min(Math.max(nextX, (boxRef.current?.offsetWidth ?? 0) / 2), containerWidth - (boxRef.current?.offsetWidth ?? 0) / 2);
    const clampedY = Math.min(Math.max(nextY, (boxRef.current?.offsetHeight ?? 0) / 2), containerHeight - (boxRef.current?.offsetHeight ?? 0) / 2);

    boxRef.current?.style && (boxRef.current.style.left = `${clampedX}px`);
    boxRef.current?.style && (boxRef.current.style.top = `${clampedY}px`);

    coords.current = {
      startX: clientX,
      startY: clientY,
      lastX: clampedX,
      lastY: clampedY,
    };
  }, [containerWidth, containerHeight]);

  useEffect(() => {
    updateMaxPositions();
    window.addEventListener('resize', updateMaxPositions);
    boxRef.current?.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
    containerRef.current?.addEventListener('mouseleave', onMouseUp);
    return () => {
      window.removeEventListener('resize', updateMaxPositions);
      boxRef.current?.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
      containerRef.current?.removeEventListener('mouseleave', onMouseUp);
    };
  }, [updateMaxPositions, onMouseDown, onMouseMove, onMouseUp]);

  return (
    <div className="App">
      <Description />
      <div ref={containerRef} className="container">
        B
        <div ref={boxRef} className="target">
          A
        </div>
      </div>
    </div>
  );
}

export default App;