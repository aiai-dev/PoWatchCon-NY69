/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-2xl text-center border-b border-orange-500/30 pb-6 mb-4">
      <h1 className="text-5xl sm:text-6xl text-glow-orange font-bold text-orange-500 mb-2 tracking-tight">Policy Watch Connect</h1>
      <div className="h-1 w-16 bg-orange-500 mx-auto mb-4 rounded-full shadow-[0_0_10px_#ff8c00]"></div>
      <h2 className="text-xl sm:text-2xl text-orange-200 font-medium tracking-[0.15em] uppercase">สวัสดีปีใหม่ ชวนสร้างสคส.ของคุณ!</h2>
    </header>
  );
};

export default Header;