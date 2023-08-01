import React, { useEffect, useRef, useCallback } from 'react';
import { Description } from './components/Description';
import { Coords } from './types/types';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const isClicked = useRef(false);
  const coords = useRef<Coords>({ startX: 0, startY: 0, lastX: 0, lastY: 0 });

  const updateMaxPositions = useCallback(() => {
    if (!containerRef.current || !boxRef.current) return;

    const { width: containerWidth, height: containerHeight } = containerRef.current.getBoundingClientRect();
    const { width: boxWidth, height: boxHeight } = boxRef.current.getBoundingClientRect();

    const clampedX = Math.min(Math.max(coords.current.lastX, (boxWidth / 2)), containerWidth - (boxWidth / 2));
    const clampedY = Math.min(Math.max(coords.current.lastY, (boxHeight / 2)), containerHeight - (boxHeight / 2));

    boxRef.current.style.left = `${(clampedX / containerWidth) * 100}%`;
    boxRef.current.style.top = `${(clampedY / containerHeight) * 100}%`;

    coords.current = {
      ...coords.current,
      lastX: clampedX,
      lastY: clampedY,
    };
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

  const onStopMoving = useCallback(() => {
    isClicked.current = false;
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isClicked.current) return;

    const { clientX, clientY } = e;
    const { startX, startY, lastX, lastY } = coords.current;

    const nextX = clientX - startX + lastX;
    const nextY = clientY - startY + lastY;

    if (!boxRef.current || !containerRef.current) return;

    const { width: boxWidth, height: boxHeight } = boxRef.current.getBoundingClientRect();
    const clampedX = Math.min(Math.max(nextX, boxWidth / 2), containerRef.current.clientWidth - boxWidth / 2);
    const clampedY = Math.min(Math.max(nextY, boxHeight / 2), containerRef.current.clientHeight - boxHeight / 2);

    boxRef.current.style.left = `${(clampedX / containerRef.current.clientWidth) * 100}%`;
    boxRef.current.style.top = `${(clampedY / containerRef.current.clientHeight) * 100}%`;

    coords.current = {
      startX: clientX,
      startY: clientY,
      lastX: clampedX,
      lastY: clampedY,
    };
  }, []);

  useEffect(() => {
    let currentBoxRef = boxRef.current;
    let currentContainerRef = containerRef.current;

    updateMaxPositions();

    window.addEventListener('resize', updateMaxPositions);
    currentBoxRef?.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onStopMoving);
    document.addEventListener('mousemove', onMouseMove);
    currentContainerRef?.addEventListener('mouseleave', onStopMoving);

    return () => {
      window.removeEventListener('resize', updateMaxPositions);
      currentBoxRef?.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onStopMoving);
      document.removeEventListener('mousemove', onMouseMove);
      currentContainerRef?.removeEventListener('mouseleave', onStopMoving);
    };
  }, [updateMaxPositions, onMouseDown, onMouseMove, onStopMoving]);

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
