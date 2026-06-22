import { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const stripItems = [
  { label: 'New Arrivals', href: '/collections/new-arrivals', isHot: true },
  { label: 'Cotton Suits', href: '/collections/cotton-suits' },
  { label: 'Kurta Sets', href: '/collections/kurta-sets' },
  { label: 'Party Wear', href: '/collections/party-wear' },
  { label: 'Designer Suits', href: '/collections/designer-suits' },
  { label: 'Silk Collection', href: '/collections/silk' },
  { label: 'Dupattas', href: '/collections/dupattas' },
  { label: 'Festive', href: '/collections/festive' },
  { label: 'Wedding', href: '/collections/wedding' },
  { label: 'Casual Wear', href: '/collections/casual' },
  { label: 'Office Wear', href: '/collections/office' },
  { label: 'Best Sellers', href: '/collections/best-sellers' },
  { label: 'Sale', href: '/sale', isSale: true },
];

export default function CategoryStrip() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  if (isAdmin) return null;

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -220 : 220, behavior: 'smooth' });
    }
  };

  const currentSlug = location.pathname.split('/').pop() || '';

  return (
    <div className="fixed left-0 right-0 z-30 bg-cream-50 border-b border-rosegold-100 top-[96px] lg:top-[104px]">
      <div className="relative max-w-screen-2xl mx-auto">
        {/* Left scroll arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 flex items-center px-2 bg-gradient-to-r from-cream-50 via-cream-50/90 to-transparent hover:text-rosegold-500 text-gray-400 transition-colors lg:hidden xl:flex"
          aria-label="Scroll left"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Scrollable strip - pill buttons */}
        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-6 py-3"
        >
          {stripItems.map(item => {
            const isActive = currentSlug === item.href.split('/').pop();
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 font-inter text-[12px] font-medium tracking-wide whitespace-nowrap rounded-full border transition-all duration-200 ${
                  isActive
                    ? 'bg-navy-700 border-navy-700 text-white shadow-sm'
                    : 'bg-white border-rosegold-200 text-navy-700 hover:border-rosegold-400 hover:text-rosegold-600'
                } ${item.isSale ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-500 hover:text-white hover:border-red-500' : ''}`}
              >
                {item.isHot && (
                  <Sparkles size={11} className="text-rosegold-400 flex-shrink-0" />
                )}
                {item.label}
                {item.isSale && !isActive && (
                  <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm tracking-wide">
                    HOT
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Right scroll arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 flex items-center px-2 bg-gradient-to-l from-cream-50 via-cream-50/90 to-transparent hover:text-rosegold-500 text-gray-400 transition-colors lg:hidden xl:flex"
          aria-label="Scroll right"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
