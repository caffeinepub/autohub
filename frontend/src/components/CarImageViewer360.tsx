import { useState, useRef, useCallback, useEffect } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface CarImageViewer360Props {
  images: string[];
  label?: string;
}

export default function CarImageViewer360({ images, label = '360° View' }: CarImageViewer360Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const dragStartX = useRef<number | null>(null);
  const lastIndex = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalImages = images.length;

  // Hide hint after first interaction
  const hideHint = useCallback(() => {
    setShowHint(false);
  }, []);

  const getIndexFromDelta = useCallback(
    (deltaX: number) => {
      if (totalImages === 0) return 0;
      // Each ~8px of drag = 1 frame
      const frameDelta = Math.round(deltaX / 8);
      const newIndex = ((lastIndex.current - frameDelta) % totalImages + totalImages) % totalImages;
      return newIndex;
    },
    [totalImages]
  );

  // Mouse events
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (totalImages === 0) return;
      e.preventDefault();
      dragStartX.current = e.clientX;
      lastIndex.current = currentIndex;
      setIsDragging(true);
      hideHint();
    },
    [currentIndex, totalImages, hideHint]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || dragStartX.current === null || totalImages === 0) return;
      const deltaX = e.clientX - dragStartX.current;
      setCurrentIndex(getIndexFromDelta(deltaX));
    },
    [isDragging, getIndexFromDelta, totalImages]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      lastIndex.current = currentIndex;
      dragStartX.current = null;
      setIsDragging(false);
    }
  }, [isDragging, currentIndex]);

  // Touch events
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (totalImages === 0) return;
      dragStartX.current = e.touches[0].clientX;
      lastIndex.current = currentIndex;
      setIsDragging(true);
      hideHint();
    },
    [currentIndex, totalImages, hideHint]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || dragStartX.current === null || totalImages === 0) return;
      e.preventDefault();
      const deltaX = e.touches[0].clientX - dragStartX.current;
      setCurrentIndex(getIndexFromDelta(deltaX));
    },
    [isDragging, getIndexFromDelta, totalImages]
  );

  const handleTouchEnd = useCallback(() => {
    if (isDragging) {
      lastIndex.current = currentIndex;
      dragStartX.current = null;
      setIsDragging(false);
    }
  }, [isDragging, currentIndex]);

  // Attach global mouse events for smooth drag outside container
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
    lastIndex.current = (currentIndex - 1 + totalImages) % totalImages;
    hideHint();
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalImages);
    lastIndex.current = (currentIndex + 1) % totalImages;
    hideHint();
  };

  if (totalImages === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-secondary/30 rounded-xl border border-border">
        <RotateCcw className="w-10 h-10 text-muted-foreground mb-3 opacity-40" />
        <p className="text-muted-foreground text-sm">No 360° images available for this view</p>
      </div>
    );
  }

  return (
    <div className="relative select-none rounded-xl overflow-hidden border border-border bg-secondary/20">
      {/* Main viewer */}
      <div
        ref={containerRef}
        className={`relative w-full h-72 md:h-96 overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Images - preload all, show current */}
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`${label} frame ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-75 ${
              idx === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            draggable={false}
            loading={idx === 0 ? 'eager' : 'lazy'}
            onLoad={() => idx === 0 && setIsLoading(false)}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ))}

        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary/50">
            <div className="flex flex-col items-center gap-2">
              <RotateCcw className="w-8 h-8 text-primary animate-spin" />
              <span className="text-sm text-muted-foreground">Loading 360° view...</span>
            </div>
          </div>
        )}

        {/* Drag hint overlay */}
        {showHint && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="bg-foreground/70 text-background rounded-xl px-5 py-3 flex flex-col items-center gap-2 backdrop-blur-sm">
              <RotateCcw className="w-7 h-7 animate-spin" style={{ animationDuration: '3s' }} />
              <span className="text-sm font-medium">Drag to rotate</span>
              <span className="text-xs opacity-70">← Swipe left or right →</span>
            </div>
          </div>
        )}

        {/* Frame counter */}
        <div className="absolute top-3 right-3 bg-foreground/60 text-background text-xs px-2 py-1 rounded-full font-medium">
          {currentIndex + 1} / {totalImages}
        </div>

        {/* Label badge */}
        <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
          <RotateCcw className="w-3 h-3" />
          {label}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border-t border-border">
        <button
          onClick={goToPrev}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-secondary"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>

        {/* Frame dots */}
        <div className="flex items-center gap-1 overflow-hidden max-w-xs">
          {totalImages <= 12 ? (
            images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setCurrentIndex(idx); lastIndex.current = idx; hideHint(); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-primary w-3' : 'bg-muted-foreground/40 hover:bg-muted-foreground'
                }`}
              />
            ))
          ) : (
            <span className="text-xs text-muted-foreground">
              Frame {currentIndex + 1} of {totalImages}
            </span>
          )}
        </div>

        <button
          onClick={goToNext}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-secondary"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
