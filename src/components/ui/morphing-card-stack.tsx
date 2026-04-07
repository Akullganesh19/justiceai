'use client';

import { useState, type ReactNode, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  type PanInfo,
  type HTMLMotionProps,
} from 'framer-motion';
import { cn } from '../../lib/utils';
import { Grid3X3, Layers, LayoutList } from 'lucide-react';

export type LayoutMode = 'stack' | 'grid' | 'list';

export interface CardData {
  id: string;
  title: string;
  description: string;
  icon?: ReactNode;
  color?: string;
}

export interface MorphingCardStackProps {
  cards?: CardData[];
  className?: string;
  defaultLayout?: LayoutMode;
  onCardClick?: (card: CardData) => void;
}

const layoutIcons = {
  stack: Layers,
  grid: Grid3X3,
  list: LayoutList,
};

const SWIPE_THRESHOLD = 50;

export function MorphingCardStack({
  cards = [],
  className,
  defaultLayout = 'stack',
  onCardClick,
}: MorphingCardStackProps) {
  const [layout, setLayout] = useState<LayoutMode>(defaultLayout);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  if (!cards || cards.length === 0) {
    return null;
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    const swipe = Math.abs(offset.x) * velocity.x;

    if (offset.x < -SWIPE_THRESHOLD || swipe < -1000) {
      // Swiped left - go to next card
      setActiveIndex((prev) => (prev + 1) % cards.length);
    } else if (offset.x > SWIPE_THRESHOLD || swipe > 1000) {
      // Swiped right - go to previous card
      setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }
    setIsDragging(false);
  };

  const getStackOrder = () => {
    const reordered = [];
    for (let i = 0; i < cards.length; i++) {
      const index = (activeIndex + i) % cards.length;
      reordered.push({ ...cards[index], stackPosition: i });
    }
    return reordered.reverse(); // Reverse so top card renders last (on top)
  };

  const getLayoutStyles = (stackPosition: number) => {
    switch (layout) {
      case 'stack':
        return {
          top: stackPosition * 8,
          left: stackPosition * 8,
          zIndex: cards.length - stackPosition,
          rotate: stackPosition * 3,
        };
      case 'grid':
        return {
          top: 0,
          left: 0,
          zIndex: 1,
          rotate: 0,
        };
      case 'list':
        return {
          top: 0,
          left: 0,
          zIndex: 1,
          rotate: 0,
        };
    }
  };

  const containerStyles = {
    stack: 'relative h-80 w-80',
    grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4',
    list: 'flex flex-col gap-4',
  };

  interface DisplayCard extends CardData {
    stackPosition: number;
  }

  const displayCards: DisplayCard[] =
    layout === 'stack' ? getStackOrder() : cards.map((c, i) => ({ ...c, stackPosition: i }));

  return (
    <div className={cn('space-y-8', className)}>
      {/* Layout Toggle */}
      <div className="flex items-center justify-center gap-1 rounded-xl bg-void border-2 border-white/5 p-1 w-fit mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
        {(Object.keys(layoutIcons) as LayoutMode[]).map((mode) => {
          const Icon = layoutIcons[mode];
          return (
            <button
              key={mode}
              onClick={() => setLayout(mode)}
              className={cn(
                'rounded-lg p-2.5 transition-all duration-300',
                layout === mode
                  ? 'bg-red text-white shadow-[2px_2px_0px_0px_rgba(159,18,57,1)]'
                  : 'text-text-tertiary hover:text-white hover:bg-void/5',
              )}
              aria-label={`Switch to ${mode} layout`}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>

      {/* Cards Container */}
      <LayoutGroup>
        <motion.div
          {...({
            layout: true,
            className: cn(containerStyles[layout], 'mx-auto px-4'),
          } as HTMLMotionProps<'div'>)}
        >
          <AnimatePresence mode="popLayout">
            {displayCards.map((card) => {
              const styles = getLayoutStyles(card.stackPosition);
              const isExpanded = expandedCard === card.id;
              const isTopCard = layout === 'stack' && card.stackPosition === 0;

              return (
                <motion.div
                  {...({
                    key: card.id,
                    layoutId: card.id,
                    initial: { opacity: 0, scale: 0.8 },
                    animate: {
                      opacity: 1,
                      scale: isExpanded ? 1.02 : 1,
                      x: 0,
                      ...styles,
                    },
                    exit: { opacity: 0, scale: 0.8, x: -100 },
                    transition: {
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                    },
                    drag: isTopCard ? 'x' : (false as any),
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.7,
                    onDragStart: () => setIsDragging(true),
                    onDragEnd: handleDragEnd,
                    whileDrag: { scale: 1.05, cursor: 'grabbing' },
                    onClick: () => {
                      if (isDragging) return;
                      setExpandedCard(isExpanded ? null : card.id);
                      onCardClick?.(card);
                    },
                    className: cn(
                      'cursor-pointer rounded-3xl border-2 p-6',
                      'transition-all duration-500 backdrop-blur-md',
                      layout === 'stack'
                        ? 'absolute w-72 h-64 bg-void shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] border-white/5'
                        : 'bg-void border-white/5',
                      layout === 'stack' &&
                        isTopCard &&
                        'cursor-grab active:cursor-grabbing hover:border-red/40',
                      layout === 'grid' && 'w-full aspect-[4/3] sm:aspect-square',
                      layout === 'list' && 'w-full min-h-[100px]',
                      isExpanded ? 'border-red shadow-[8px_8px_0px_0px_rgba(225,29,72,0.1)]' : '',
                    ),
                  } as HTMLMotionProps<'div'>)}
                >
                  <div
                    className={cn(
                      'flex gap-4 h-full',
                      layout === 'list' ? 'flex-row items-center' : 'flex-col',
                    )}
                  >
                    {card.icon && (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red/10 text-red border-2 border-red/20 group-hover:bg-red group-hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                        {card.icon}
                      </div>
                    )}
                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                      <h3 className="font-display font-bold text-white truncate text-lg uppercase tracking-tight">
                        {card.title}
                      </h3>
                      <p
                        className={cn(
                          'text-sm text-text-tertiary mt-2 font-body leading-relaxed',
                          layout === 'stack' && 'line-clamp-4',
                          layout === 'grid' && 'line-clamp-3',
                          layout === 'list' && 'line-clamp-2',
                        )}
                      >
                        {card.description}
                      </p>
                    </div>
                  </div>

                  {isTopCard && (
                    <div className="absolute bottom-4 left-0 right-0 text-center animate-pulse">
                      <span className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-red/40">
                        Swipe to Next
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {layout === 'stack' && cards.length > 1 && (
        <div className="flex justify-center gap-1.5 pt-4">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                index === activeIndex
                  ? 'w-6 bg-red shadow-[0_0_8px_rgba(225,29,72,0.5)]'
                  : 'w-1.5 bg-void/10 hover:bg-void/20',
              )}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
