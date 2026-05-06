import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function MagneticWrapper({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const move = (e) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = element.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);

      gsap.to(element, {
        x: x * 0.15,
        y: y * 0.15,
        duration: 1,
        ease: 'power3.out',
      });
    };

    const leave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 1,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    element.addEventListener('mousemove', move);
    element.addEventListener('mouseleave', leave);

    return () => {
      element.removeEventListener('mousemove', move);
      element.removeEventListener('mouseleave', leave);
    };
  }, []);

  // Clone the child to attach the ref
  return React.cloneElement(children, { ref });
}
