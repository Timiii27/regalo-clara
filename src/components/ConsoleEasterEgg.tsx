'use client';

import { useEffect } from 'react';

export default function ConsoleEasterEgg() {
  useEffect(() => {
    console.clear();
    console.log(
      `%c
      
      /\\
     /  \\
    /____\\
   (      )
   /      \\
  /        \\
 /__________\\
      ||
      ||
      
      HO HO HO!
      Busca donde guardo mis juguetes...
      
      `,
      'font-family: monospace; color: #ccff00; font-size: 14px; font-weight: bold; text-shadow: 2px 2px #ff0099;'
    );
  }, []);

  return null;
}
