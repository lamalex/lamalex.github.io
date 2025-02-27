import { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import { mousePosition, setMousePosition, resetMousePosition } from '../stores/mousePosition';

const SETTINGS_VERSION = '20250220257';

const DotGrid = ({links, preventScroll = false }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isInverted, setIsInverted] = useState(() => {
    const saved = window.localStorage.getItem(`dotGridInverted${SETTINGS_VERSION}`);
    return saved ? saved === 'true' : true;
  });
  const mousePos = useStore(mousePosition);
  const baseDotSpacing = 7; // Base spacing when dot radius is 2
  const getSpacing = (radius) => (radius / 2) * baseDotSpacing; // Adjust spacing proportionally to radius
  const [dotRadius, setDotRadius] = useState(() => {
    const saved = localStorage.getItem(`dotGridZoom${SETTINGS_VERSION}`);
    return saved ? parseFloat(saved) : 7;
  });
  const [_, setIsScrolling] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !dimensions.width || !dimensions.height) return;

    const ctx = canvas.getContext('2d');
    const DPR = window.devicePixelRatio || 1;

    canvas.width = dimensions.width * DPR;
    canvas.height = dimensions.height * DPR;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    ctx.scale(DPR, DPR);

    const DOT_RADIUS = dotRadius;
    const DOT_SPACING = getSpacing(DOT_RADIUS);
    
    const createTextMap = (text, baseX, baseY) => {
      const textMap = new Set();
      let currentX = baseX;
      
      // Scale text size with dot size
      const letterSpacing = DOT_SPACING * 8;
      const letterHeight = DOT_SPACING * 6;
      const letterWidth = DOT_SPACING * 5;

      const addStroke = (startX, startY, endX, endY) => {
        const dx = endX - startX;
        const dy = endY - startY;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        const strokeW = Math.max(2, DOT_RADIUS * 2); // Double the stroke width
        
        // Calculate the stroke rectangle corners
        const cos = dx / length;
        const sin = dy / length;
        const perpX = -sin * strokeW;
        const perpY = cos * strokeW;

        // Get grid-aligned bounding box
        const padding = DOT_SPACING * 2;
        const points = [
          [startX - perpX, startY - perpY],
          [startX + perpX, startY + perpY],
          [endX + perpX, endY + perpY],
          [endX - perpX, endY - perpY]
        ];

        const minX = Math.floor((Math.min(...points.map(p => p[0])) - padding) / DOT_SPACING) * DOT_SPACING;
        const maxX = Math.ceil((Math.max(...points.map(p => p[0])) + padding) / DOT_SPACING) * DOT_SPACING;
        const minY = Math.floor((Math.min(...points.map(p => p[1])) - padding) / DOT_SPACING) * DOT_SPACING;
        const maxY = Math.ceil((Math.max(...points.map(p => p[1])) + padding) / DOT_SPACING) * DOT_SPACING;

        // Distance from point to line segment
        const distToSegment = (px, py) => {
          const t = ((px - startX) * dx + (py - startY) * dy) / (length * length);
          if (t < 0) return Math.hypot(px - startX, py - startY);
          if (t > 1) return Math.hypot(px - endX, py - endY);
          
          const projX = startX + t * dx;
          const projY = startY + t * dy;
          return Math.hypot(px - projX, py - projY);
        };

        // Sample points in the grid
        for (let x = minX; x <= maxX; x += DOT_SPACING) {
          for (let y = minY; y <= maxY; y += DOT_SPACING) {
            // If point is within stroke width of the line, add it
            if (distToSegment(x, y) <= strokeW * 1.2) { // 1.2 factor for better coverage
              textMap.add(`${x},${y}`);
            }
          }
        }
      };

      text.split('').forEach((char) => {
        const h = letterHeight;
        const w = letterWidth;

        switch(char.toUpperCase()) {
          case 'H':
            addStroke(currentX, baseY, currentX, baseY + h);
            addStroke(currentX + w, baseY, currentX + w, baseY + h);
            addStroke(currentX, baseY + h/2, currentX + w, baseY + h/2);
            break;
          case 'O':
            const segments = 16;
            for (let i = 0; i <= segments; i++) {
              const angle = (i / segments) * Math.PI * 2;
              const nextAngle = ((i + 1) / segments) * Math.PI * 2;
              const x1 = currentX + w/2 + Math.cos(angle) * w/2;
              const y1 = baseY + h/2 + Math.sin(angle) * h/2;
              const x2 = currentX + w/2 + Math.cos(nextAngle) * w/2;
              const y2 = baseY + h/2 + Math.sin(nextAngle) * h/2;
              addStroke(x1, y1, x2, y2);
            }
            break;
          case 'M':
            addStroke(currentX, baseY, currentX, baseY + h);
            addStroke(currentX + w, baseY, currentX + w, baseY + h);
            addStroke(currentX, baseY, currentX + w/2, baseY + h/2);
            addStroke(currentX + w, baseY, currentX + w/2, baseY + h/2);
            break;
          case 'E':
            addStroke(currentX, baseY, currentX, baseY + h);
            addStroke(currentX, baseY, currentX + w * 0.8, baseY);
            addStroke(currentX, baseY + h/2, currentX + w*0.6, baseY + h/2);
            addStroke(currentX, baseY + h, currentX + w * 0.8, baseY + h);
            break;
          case 'B':
            // Main vertical line
            addStroke(currentX, baseY, currentX, baseY + h);
            
            // Top horizontal lines
            addStroke(currentX, baseY, currentX + w*0.5, baseY);
            addStroke(currentX, baseY + h/2, currentX + w*0.6, baseY + h/2);
            
            // Bottom horizontal lines
            addStroke(currentX, baseY + h, currentX + w*0.5, baseY + h);
            
            // Right vertical lines
            addStroke(currentX + w*0.8, baseY+h/8, currentX + w*0.8, baseY + h/4);
            addStroke(currentX + w*0.8, baseY + h*2/3, currentX + w*0.8, baseY + h*0.8);
            break;
          case 'L':
            addStroke(currentX, baseY, currentX, baseY + h);
            addStroke(currentX, baseY + h, currentX + w, baseY + h);
            break;
          case 'G':
            // Left vertical
            addStroke(currentX, baseY + h * 0.2, currentX, baseY + h * 0.8);

            // Top horizontal
            addStroke(currentX + w * 0.2, baseY, currentX + w * 0.6, baseY);

            // Serif horizontal
            addStroke(currentX + w * 0.6, baseY + h*0.7, currentX + w*0.8, baseY + h*0.7);

            // Bottom horizontal
            addStroke(currentX + w * 0.2, baseY + h, currentX + w * 0.6, baseY + h);

            // Right vertical segments
            addStroke(currentX + w * 0.8, baseY + h * 0.2, currentX + w * 0.8, baseY + h * 0.21);
            addStroke(currentX + w * 0.8, baseY + h * 0.7, currentX + w * 0.8, baseY + h);
            break;
          case 'C':
            // Left vertical
            addStroke(currentX, baseY+h*0.2, currentX, baseY + h*0.8);
            
            // Top horizontal
            addStroke(currentX + w*0.2, baseY, currentX + w*0.6, baseY);
            
            // Bottom horizontal
            addStroke(currentX + w*0.2, baseY + h, currentX + w*0.6, baseY + h);
            
            // Right vertical segments
            addStroke(currentX + w*0.8, baseY+h*0.2, currentX + w*0.8, baseY + h*0.21);
            addStroke(currentX + w*0.8, baseY + h*0.8, currentX + w*0.8, baseY + h*0.81);
            break;
          case 'V':
            addStroke(currentX, baseY, currentX + w/2, baseY + h);
            addStroke(currentX + w, baseY, currentX + w/2, baseY + h);
            break;
        }
        currentX += letterSpacing;
      });
      
      return textMap;
    };

    const createBoundingBox = (textMap) => {
      const coords = Array.from(textMap).map(coord => {
        const [x, y] = coord.split(',').map(Number);
        return { x, y };
      });
      
      const minX = Math.min(...coords.map(c => c.x)) - DOT_SPACING;
      const maxX = Math.max(...coords.map(c => c.x)) + DOT_SPACING;
      const minY = Math.min(...coords.map(c => c.y)) - DOT_SPACING;
      const maxY = Math.max(...coords.map(c => c.y)) + DOT_SPACING;
      
      const boxDots = new Set();
      for (let x = minX; x <= maxX; x += DOT_SPACING) {
        for (let y = minY; y <= maxY; y += DOT_SPACING) {
          boxDots.add(`${x},${y}`);
        }
      }
      return boxDots;
    };

    const textMaps = [];
    const textAreas = {};
    
    // Create link text maps
    links.forEach((link, index) => {
      const linkMap = createTextMap(link.text, DOT_SPACING * 5, DOT_SPACING * (5 + index * 10));
      textMaps.push(linkMap);
      textAreas[link.text] = {
        dots: createBoundingBox(linkMap),
        route: link.route,
      };
    });

    const allTextDots = new Set(textMaps.flatMap(map => Array.from(map)));

    const calculateDistortion = (dotX, dotY, forceX, forceY) => {
      const dx = dotX - forceX;
      const dy = dotY - forceY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxForce = 1000;
      const maxDisplacement = DOT_SPACING * (5 + Math.log(Math.min(forceX, forceY)));
      
      if (distance > maxForce) return { x: dotX, y: dotY };
      
      const force = Math.pow(1 - distance / maxForce, 2);
      const displacement = force * maxDisplacement;
      const angle = Math.atan2(dy, dx);
      
      return {
        x: dotX - Math.cos(angle) * displacement,
        y: dotY - Math.sin(angle) * displacement
      };
    };

    const drawDot = (x, y, isFilled, isText) => {
      const finalPos = calculateDistortion(x, y, mousePos.x, mousePos.y);
      
      const progress = (x + y) / (dimensions.width + dimensions.height);
      const hue = progress * 360;
      
      ctx.beginPath();
      ctx.arc(finalPos.x, finalPos.y, DOT_RADIUS, 0, Math.PI * 2);
      
      if (isFilled) {
        ctx.fillStyle = isText ? `hsl(${hue}, 85%, 60%)` : `hsl(${hue}, 85%, 60%)`;
        ctx.fill();
      } else {
        ctx.strokeStyle = `hsl(${hue}, 85%, 60%)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      for (let x = -DOT_SPACING; x <= dimensions.width + DOT_SPACING; x += DOT_SPACING) {
        for (let y = -DOT_SPACING; y <= dimensions.height + DOT_SPACING; y += DOT_SPACING) {
          const key = `${x},${y}`;
          const isTextDot = allTextDots.has(key);
          drawDot(x, y, isTextDot !== isInverted, isTextDot);
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(render);
    };

    const handleGlobalMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      
      // Get the mouse position relative to the document
      const x = e.clientX;
      const y = e.clientY;
      
      // Convert to canvas coordinates
      const canvasX = x * (canvas.width / rect.width);
      const canvasY = y * (canvas.height / rect.height);
      
      setMousePosition(canvasX / DPR, canvasY / DPR);
    };

    const handleCanvasMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width) / DPR;
      const y = (e.clientY - rect.top) * (canvas.height / rect.height) / DPR;
      
      const gridX = Math.round(x / DOT_SPACING) * DOT_SPACING;
      const gridY = Math.round(y / DOT_SPACING) * DOT_SPACING;
      const key = `${gridX},${gridY}`;
      
      let isOverText = false;
      for (const area of Object.values(textAreas)) {
        if (area.dots.has(key)) {
          isOverText = true;
          break;
        }
      }
      
      canvas.style.cursor = isOverText ? 'pointer' : 'default';
    };

    const handleMouseLeave = () => {
      resetMousePosition();
    };

    const handleClick = (e) => {
      // Don't process clicks that are on content elements
      const isContentClick = e.target.closest('.pointer-events-auto');
      if (isContentClick) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width) / DPR;
      const y = (e.clientY - rect.top) * (canvas.height / rect.height) / DPR;
      
      const gridX = Math.round(x / DOT_SPACING) * DOT_SPACING;
      const gridY = Math.round(y / DOT_SPACING) * DOT_SPACING;
      const key = `${gridX},${gridY}`;

      for (const [text, area] of Object.entries(textAreas)) {
        if (area.dots.has(key)) {
          // Store current inversion state before navigation
          window.localStorage.setItem(`dotGridInverted${SETTINGS_VERSION}`, isInverted.toString());
          window.location.href = area.route;
          return;
        }
      }
      
      if (!allTextDots.has(key)) {
        setIsInverted(prev => {
          const newValue = !prev;
          window.localStorage.setItem(`dotGridInverted${SETTINGS_VERSION}`, newValue.toString());
          return newValue;
        });
      }
    };

    // Touch event handlers
    const handleTouchStart = (e) => {
      // Only prevent default if we explicitly want to prevent scroll
      if (preventScroll) {
        e.preventDefault();
      }
      setIsDragging(false);
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = (touch.clientX - rect.left) * (canvas.width / rect.width) / DPR;
      const y = (touch.clientY - rect.top) * (canvas.height / rect.height) / DPR;
      setMousePosition(x, y);
    };

    const handleTouchMove = (e) => {
      // Only prevent default if we explicitly want to prevent scroll
      if (preventScroll) {
        e.preventDefault();
      }
      setIsDragging(true);
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = (touch.clientX - rect.left) * (canvas.width / rect.width) / DPR;
      const y = (touch.clientY - rect.top) * (canvas.height / rect.height) / DPR;
      setMousePosition(x, y);
    };

    const handleTouchEnd = (e) => {
      // Check if the touch started on a content element
      const target = e.target;
      const isContentArea = target.closest('.pointer-events-auto');
      
      if (isContentArea) {
        // Let the event bubble up for content interaction
        return;
      }

      if (preventScroll) {
        e.preventDefault();
      }
      const touch = e.changedTouches[0];
      const rect = canvas.getBoundingClientRect();
      const x = (touch.clientX - rect.left) * (canvas.width / rect.width) / DPR;
      const y = (touch.clientY - rect.top) * (canvas.height / rect.height) / DPR;
      
      const gridX = Math.round(x / DOT_SPACING) * DOT_SPACING;
      const gridY = Math.round(y / DOT_SPACING) * DOT_SPACING;
      const key = `${gridX},${gridY}`;

      for (const [text, area] of Object.entries(textAreas)) {
        if (area.dots.has(key)) {
          // Store current inversion state before navigation
          window.localStorage.setItem(`dotGridInverted${SETTINGS_VERSION}`, isInverted.toString());
          window.location.href = area.route;
          setIsDragging(false);
          resetMousePosition(); // Only reset position when navigating
          return;
        }
      }
      
      if (!allTextDots.has(key) && !isDragging) {
        setIsInverted(prev => {
          const newValue = !prev;
          window.localStorage.setItem(`dotGridInverted${SETTINGS_VERSION}`, newValue.toString());
          return newValue;
        });
      }
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: !preventScroll });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: !preventScroll });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: !preventScroll });

    const handleWheel = (e) => {
      e.preventDefault();
      
      // Use actual deltaY for smooth transitions
      const scrollSensitivity = 0.003; // Increased sensitivity for larger range
      
      // Update dot radius
      setDotRadius(prev => {
        const newRadius = Math.max(2, Math.min(25, prev + (e.deltaY * scrollSensitivity)));
        localStorage.setItem(`dotGridZoom${SETTINGS_VERSION}`, newRadius.toString());
        return newRadius;
      });

      // Set scrolling state
      setIsScrolling(true);
      
      // Clear previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Set new timeout
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    
    render();

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('mousemove', handleCanvasMouseMove);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [dimensions, isInverted, mousePos, dotRadius]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-screen overflow-hidden" style={{ backgroundColor: isInverted ? '#fff' : '#444', transition: 'background-color 0.3s ease' }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />
    </div>
  );
};

export default DotGrid;