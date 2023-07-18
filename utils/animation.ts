/** popUpItem을 감싸서 item의 애니메이션이 순서대로 동작하게 한다. */
export const popUpContainer = {
  variants: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  initial: 'hidden',
  animate: 'show',
  viewport: { once: true },
};

/** 애니메이션 item. popUpContainer와 같이 사용한다. */
export const popUpItem = {
  variants: {
    hidden: { y: 30, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        type: 'spring',
        stiffness: 70,
      },
    },
  },
  viewport: { once: true },
};
