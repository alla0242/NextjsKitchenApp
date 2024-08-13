import { useRef, useEffect } from "react";

export function useOnDraw(onDraw) {
    const canvasRef = useRef(null);
    const prevPointRef = useRef(null);
    const isDrawingRef = useRef(false);
    const mouseMoveListenerRef = useRef(null);
    const mouseUpListenerRef = useRef(null);

    useEffect(() => {
        function initMouseMoveListener() {
            const mouseMoveListener = (e) => {
                if (isDrawingRef.current) {
                    const point = computePointInCanvas(e.clientX, e.clientY);
                    const ctx = canvasRef.current.getContext('2d');
                    if (onDraw) onDraw(ctx, point, prevPointRef.current);
                    prevPointRef.current = point;
                }
            };
            mouseMoveListenerRef.current = mouseMoveListener;
            window.addEventListener("mousemove", mouseMoveListener);
        }

        function initMouseUpListener() {
            const listener = () => {
                isDrawingRef.current = false;
                prevPointRef.current = false;
            };
            mouseUpListenerRef.current = listener;
            window.addEventListener("mouseup", listener);
        }

        function initTouchMoveListener() {
            const touchMoveListener = (e) => {
                if (isDrawingRef.current) {
                    const touch = e.touches[0];
                    const point = computePointInCanvas(touch.clientX, touch.clientY);
                    const ctx = canvasRef.current.getContext('2d');
                    if (onDraw) onDraw(ctx, point, prevPointRef.current);
                    prevPointRef.current = point;
                }
            };
            window.addEventListener("touchmove", touchMoveListener);
        }

        function initTouchEndListener() {
            const listener = () => {
                isDrawingRef.current = false;
                prevPointRef.current = false;
            };
            window.addEventListener("touchend", listener);
        }

        function computePointInCanvas(clientX, clientY) {
            if (canvasRef.current) {
                const boundingRect = canvasRef.current.getBoundingClientRect();
                return {
                    x: clientX - boundingRect.left,
                    y: clientY - boundingRect.top
                };
            }
        }

        function removeListeners() {
            if (mouseMoveListenerRef.current) {
                window.removeEventListener('mousemove', mouseMoveListenerRef.current);
            }
            if (mouseUpListenerRef.current) {
                window.removeEventListener('mouseup', mouseUpListenerRef.current);
            }
            window.removeEventListener('touchmove', initTouchMoveListener);
            window.removeEventListener('touchend', initTouchEndListener);
        }

        initMouseMoveListener();
        initMouseUpListener();
        initTouchMoveListener();
        initTouchEndListener();

        return () => {
            removeListeners();
        };
    }, [onDraw]);

    function setCanvasRef(ref) {
        canvasRef.current = ref;
    }

    function onMouseDown() {
        isDrawingRef.current = true;
    }

    function onTouchStart(e) {
        e.preventDefault(); // Prevent default touch behavior
        e.stopPropagation();
        isDrawingRef.current = true;
    }

    return {
        setCanvasRef,
        onMouseDown,
        onTouchStart
    };
}