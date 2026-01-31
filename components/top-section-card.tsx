'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const styles = {
  cardContainer: ['@container/card', 'aspect-square', 'w-full', 'max-w-[150px]', 'min-[400px]:max-w-[167px]'].join(' '),
  card: ['@container/card', 'h-full', 'p-2', 'flex', 'flex-col', 'justify-between'].join(' '),
  cardHeader: ['card-header'].join(' '),
  cardTitleBase: ['font-semibold', 'tabular-nums'].join(' '),
  cardFooter: ['flex-col', 'items-start', 'gap-1.5', 'text-xs'].join(' '),
  cardDescription: ['text-sm', 'max-[400px]:text-xs'].join(' '),
};

const fontSizeClasses = ['text-5xl', 'text-4xl', 'text-3xl', 'text-2xl', 'text-xl', 'text-lg'];

export default function CompaniesInterviewed({
  title,
  value,
  footerText,
}: {
  title: string;
  value: string;
  footerText: string | ReactNode;
}) {
  const titleRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSizeClass, setFontSizeClass] = useState('text-5xl');

  useEffect(() => {
    const adjustFontSize = () => {
      if (!titleRef.current) return;

      const cardTitleElement = titleRef.current.parentElement;
      const headerElement = cardTitleElement?.parentElement;
      if (!headerElement || headerElement.getAttribute('data-slot') !== 'card-header') return;

      const headerStyle = window.getComputedStyle(headerElement);
      const paddingLeft = parseFloat(headerStyle.paddingLeft) || 0;
      const paddingRight = parseFloat(headerStyle.paddingRight) || 0;
      const availableWidth = headerElement.offsetWidth - paddingLeft - paddingRight;

      const measureEl = document.createElement('span');
      measureEl.style.position = 'absolute';
      measureEl.style.visibility = 'hidden';
      measureEl.style.whiteSpace = 'nowrap';
      measureEl.textContent = value;

      const titleElement = titleRef.current.parentElement;
      if (titleElement) {
        const computedStyle = window.getComputedStyle(titleElement);
        measureEl.style.fontFamily = computedStyle.fontFamily;
        measureEl.style.fontWeight = computedStyle.fontWeight;
        measureEl.style.letterSpacing = computedStyle.letterSpacing;
      }
      document.body.appendChild(measureEl);

      let selectedSize = fontSizeClasses[fontSizeClasses.length - 1];

      for (const sizeClass of fontSizeClasses) {
        measureEl.className = `${styles.cardTitleBase} ${sizeClass}`;
        void measureEl.offsetHeight;

        const textWidth = measureEl.offsetWidth;

        if (textWidth <= availableWidth) {
          selectedSize = sizeClass;
          break;
        }
      }

      document.body.removeChild(measureEl);

      setFontSizeClass(selectedSize);
    };

    let resizeObserver: ResizeObserver | null = null;
    const setupObserver = () => {
      const cardTitleElement = titleRef.current?.parentElement;
      const headerElement = cardTitleElement?.parentElement;
      if (headerElement && headerElement.getAttribute('data-slot') === 'card-header') {
        resizeObserver = new ResizeObserver(() => {
          adjustFontSize();
        });
        resizeObserver.observe(headerElement);
      }
    };

    const timeoutId = setTimeout(() => {
      requestAnimationFrame(() => {
        adjustFontSize();
        setupObserver();
      });
    }, 0);

    window.addEventListener('resize', adjustFontSize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', adjustFontSize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [value]);

  return (
    <div className={styles.cardContainer} ref={containerRef}>
      <Card className={styles.card}>
        <CardHeader>
          <CardDescription className={styles.cardDescription}>{title}</CardDescription>
          <CardTitle className={`${styles.cardTitleBase} ${fontSizeClass}`}>
            <span ref={titleRef}>{value}</span>
          </CardTitle>
        </CardHeader>
        <CardFooter className={styles.cardFooter}>
          <div className="text-muted-foreground italic">{footerText}</div>
        </CardFooter>
      </Card>
    </div>
  );
}
