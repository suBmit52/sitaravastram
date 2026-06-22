import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Menu, X, ChevronDown, Phone, Globe, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartCount, toggleCart } from '../../store/cartSlice';
import { selectWishlistIds } from '../../store/wishlistSlice';

// ─── Currency Config ──────────────────────────────────────────────────────────
const currencies = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee', flag: '🇮🇳', rate: 1 },
  { code: 'USD', symbol: '$', label: 'US Dollar', flag: '🇺🇸', rate: 0.012 },
  { code: 'GBP', symbol: '£', label: 'British Pound', flag: '🇬🇧', rate: 0.0095 },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham', flag: '🇦🇪', rate: 0.044 },
  { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar', flag: '🇨🇦', rate: 0.016 },
  { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar', flag: '🇸🇬', rate: 0.016 },
];

// Export so ProductCard and prices can use it
export const useCurrency = () => {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('sv_currency') : null;
  return currencies.find(c => c.code === stored) || currencies[0];
};

// ─── Mega Menu Data ───────────────────────────────────────────────────────────
const megaMenus = {
  'New In': {
    sections: [
      {
        title: 'Just Arrived',
        links: [
          { label: 'New Arrivals', href: '/collections/new-arrivals', isNew: true },
          { label: 'This Week\'s Picks', href: '/collections/new-arrivals' },
          { label: 'Coming Soon', href: '/collections' },
        ],
      },
      {
        title: 'Trending Now',
        links: [
          { label: 'Best Sellers', href: '/collections/best-sellers' },
          { label: 'Editor\'s Picks', href: '/collections/featured' },
          { label: 'Most Wished', href: '/account/wishlist' },
        ],
      },
    ],
    featured: [
      {
        image: 'https://images.pexels.com/photos/7176430/pexels-photo-7176430.jpeg?auto=compress&cs=tinysrgb&w=400',
        title: 'Summer Edit',
        href: '/collections/cotton-suits',
      },
      {
        image: 'https://images.pexels.com/photos/4048043/pexels-photo-4048043.jpeg?auto=compress&cs=tinysrgb&w=400',
        title: 'Silk Stories',
        href: '/collections/silk',
      },
    ],
  },
  'Shop': {
    sections: [
      {
        title: 'By Category',
        links: [
          { label: 'Cotton Suits', href: '/collections/cotton-suits' },
          { label: 'Kurta Sets', href: '/collections/kurta-sets' },
          { label: 'Party Wear', href: '/collections/party-wear' },
          { label: 'Designer Suits', href: '/collections/designer-suits' },
          { label: 'Dupattas', href: '/collections/dupattas' },
          { label: 'Silk Collection', href: '/collections/silk' },
        ],
      },
      {
        title: 'By Fabric',
        links: [
          { label: 'Cotton', href: '/collections?fabric=cotton' },
          { label: 'Silk & Chanderi', href: '/collections?fabric=silk' },
          { label: 'Chiffon', href: '/collections?fabric=chiffon' },
          { label: 'Linen', href: '/collections?fabric=linen' },
          { label: 'Georgette', href: '/collections?fabric=georgette' },
          { label: 'Rayon', href: '/collections?fabric=rayon' },
        ],
      },
    ],
    featured: [
      {
        image: 'https://images.pexels.com/photos/33824984/pexels-photo-33824984.jpeg?auto=compress&cs=tinysrgb&w=400',
        title: 'Cotton Edit',
        href: '/collections/cotton-suits',
      },
      {
        image: 'https://images.pexels.com/photos/20690511/pexels-photo-20690511.jpeg?auto=compress&cs=tinysrgb&w=400',
        title: 'Kurtas & Sets',
        href: '/collections/kurta-sets',
      },
    ],
  },
  'Occasions': {
    sections: [
      {
        title: 'Shop by Occasion',
        links: [
          { label: 'Casual Everyday', href: '/collections/casual' },
          { label: 'Office & Work', href: '/collections/office' },
          { label: 'Party & Nights Out', href: '/collections/party' },
          { label: 'Festive & Pooja', href: '/collections/festive' },
          { label: 'Wedding & Bridal', href: '/collections/wedding' },
          { label: 'Gift Ideas', href: '/collections' },
        ],
      },
      {
        title: 'Special Edits',
        links: [
          { label: 'Diwali Collection', href: '/collections/festive' },
          { label: 'Eid Special', href: '/collections/festive' },
          { label: 'Navratri Edit', href: '/collections/festive' },
          { label: 'Bridal Trousseau', href: '/collections/wedding' },
        ],
      },
    ],
    featured: [
      {
        image: 'https://images.pexels.com/photos/7176428/pexels-photo-7176428.jpeg?auto=compress&cs=tinysrgb&w=400',
        title: 'Festive Wear',
        href: '/collections/festive',
      },
      {
        image: 'https://images.pexels.com/photos/14037486/pexels-photo-14037486.jpeg?auto=compress&cs=tinysrgb&w=400',
        title: 'Wedding Edit',
        href: '/collections/wedding',
      },
    ],
  },
};

type MegaMenuKey = keyof typeof megaMenus;
const leftNavItems: MegaMenuKey[] = ['New In', 'Shop', 'Occasions'];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<MegaMenuKey | null>(null);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileExpandedItem, setMobileExpandedItem] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const wishlistIds = useSelector(selectWishlistIds);
  const isHome = location.pathname === '/';

  // Load persisted currency
  useEffect(() => {
    const stored = localStorage.getItem('sv_currency');
    const found = currencies.find(c => c.code === stored);
    if (found) setSelectedCurrency(found);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveMega(null);
    setCurrencyOpen(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleCurrencySelect = (currency: typeof currencies[0]) => {
    setSelectedCurrency(currency);
    localStorage.setItem('sv_currency', currency.code);
    setCurrencyOpen(false);
  };

  const openMega = useCallback((key: MegaMenuKey) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setActiveMega(key);
  }, []);

  const closeMega = useCallback(() => {
    leaveTimer.current = setTimeout(() => setActiveMega(null), 120);
  }, []);

  const keepMegaOpen = useCallback(() => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
  }, []);

  const isScrolledOrNotHome = scrolled || !isHome;
  const textCol = isScrolledOrNotHome ? 'text-navy-700' : 'text-white';
  const logoFilter = isScrolledOrNotHome ? '' : 'brightness-0 invert';
  const navBg = isScrolledOrNotHome
    ? 'bg-white/97 backdrop-blur-xl shadow-[0_2px_24px_rgba(27,42,74,0.10)] border-b border-rosegold-200/50'
    : 'bg-transparent';

  return (
    <>
      {/* ── Announcement Bar ────────────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-navy-700 text-white text-center py-2 px-4">
        <span className="font-inter text-[11px] tracking-[0.18em] uppercase">
          <span className="hidden sm:inline">
            Use code <strong className="text-rosegold-300">SITARA10</strong> for 10% off your first order
            &ensp;·&ensp; Free shipping above ₹999
            &ensp;·&ensp; COD available Pan-India
            &ensp;·&ensp; 7-day easy returns
          </span>
          <span className="sm:hidden">
            Code <strong className="text-rosegold-300">SITARA10</strong> → 10% off · Free ship ₹999+
          </span>
        </span>
      </div>

      {/* ── Main Navbar ──────────────────────────────────────────────────────── */}
      <header
        className={`fixed left-0 right-0 z-40 transition-all duration-500 ${navBg}`}
        style={{ top: '32px' }}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-3 items-center h-16 lg:h-[72px]">

            {/* ── LEFT: Nav Links (desktop) + Hamburger (mobile) ────────────── */}
            <div className="flex items-center gap-1">
              {/* Mobile hamburger */}
              <button
                className={`lg:hidden p-2 transition-colors ${textCol} hover:text-rosegold-500`}
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>

              {/* Desktop left nav */}
              <nav className="hidden lg:flex items-center gap-1">
                {leftNavItems.map(key => (
                  <div
                    key={key}
                    className="relative"
                    onMouseEnter={() => openMega(key)}
                    onMouseLeave={closeMega}
                  >
                    <button
                      className={`flex items-center gap-1 px-3 py-2 font-inter text-[13px] font-medium tracking-wide transition-colors duration-200 hover:text-rosegold-500 rounded-sm ${textCol} ${activeMega === key ? '!text-rosegold-500' : ''}`}
                    >
                      {key}
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-200 ${activeMega === key ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                ))}
                <Link
                  to="/sale"
                  className="px-3 py-2 font-inter text-[13px] font-semibold tracking-wide text-red-500 hover:text-red-600 transition-colors"
                >
                  Sale
                </Link>
              </nav>
            </div>

            {/* ── CENTER: Logo ──────────────────────────────────────────────── */}
            <div className="flex justify-center">
              <Link to="/" className="flex-shrink-0">
                <img
                  src="/assets/images/sitaravastram_logo.webp"
                  alt="Sitara Vastram"
                  className={`h-11 lg:h-13 w-auto transition-all duration-500 ${logoFilter}`}
                  style={{ height: scrolled ? '44px' : '52px' }}
                />
              </Link>
            </div>

            {/* ── RIGHT: Actions ────────────────────────────────────────────── */}
            <div className="flex items-center justify-end gap-0.5 sm:gap-1">
              {/* Search */}
              <button
                className={`p-2.5 transition-colors hover:text-rosegold-500 ${textCol}`}
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Currency Selector */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setCurrencyOpen(!currencyOpen)}
                  className={`flex items-center gap-1 px-2 py-2 font-inter text-xs font-medium transition-colors hover:text-rosegold-500 ${textCol}`}
                  aria-label="Change currency"
                >
                  <Globe size={15} />
                  <span className="hidden md:inline">{selectedCurrency.code}</span>
                  <ChevronDown size={11} className={`transition-transform ${currencyOpen ? 'rotate-180' : ''}`} />
                </button>

                {currencyOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-sm shadow-luxury-lg border border-rosegold-100 py-1.5 z-50">
                    <p className="px-4 py-1.5 text-[10px] font-inter font-semibold text-gray-400 uppercase tracking-widest border-b border-rosegold-50 mb-1">
                      Select Currency
                    </p>
                    {currencies.map(c => (
                      <button
                        key={c.code}
                        onClick={() => handleCurrencySelect(c)}
                        className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm font-inter transition-colors hover:bg-cream-100 ${selectedCurrency.code === c.code ? 'text-rosegold-500 bg-rosegold-50' : 'text-navy-700'}`}
                      >
                        <span className="text-base flex-shrink-0">{c.flag}</span>
                        <div className="text-left flex-1 min-w-0">
                          <span className="font-semibold">{c.symbol} {c.code}</span>
                          <span className="text-xs text-gray-400 ml-1.5">{c.label}</span>
                        </div>
                        {selectedCurrency.code === c.code && (
                          <span className="w-2 h-2 rounded-full bg-rosegold-500 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link
                to="/account/wishlist"
                className={`relative p-2.5 transition-colors hover:text-rosegold-500 ${textCol}`}
                aria-label="Wishlist"
              >
                <Heart size={18} />
                {wishlistIds.length > 0 && (
                  <span className="absolute top-1.5 right-1 w-3.5 h-3.5 bg-rosegold-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold leading-none">
                    {wishlistIds.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                className={`relative p-2.5 transition-colors hover:text-rosegold-500 ${textCol}`}
                onClick={() => dispatch(toggleCart())}
                aria-label="Shopping bag"
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1 w-3.5 h-3.5 bg-rosegold-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold leading-none">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Account */}
              <Link
                to="/account"
                className={`hidden md:flex items-center gap-1.5 ml-1 px-3 py-2 text-xs font-inter font-semibold tracking-wide rounded-sm border transition-all duration-200 ${isScrolledOrNotHome ? 'border-navy-200 text-navy-700 hover:bg-navy-700 hover:text-white hover:border-navy-700' : 'border-white/50 text-white hover:bg-white hover:text-navy-700'}`}
                aria-label="My Account"
              >
                <User size={14} />
                Account
              </Link>
            </div>
          </div>
        </div>

        {/* ── Mega Menu Panel ──────────────────────────────────────────────────── */}
        {activeMega && megaMenus[activeMega] && (
          <div
            ref={megaRef}
            className="absolute left-0 right-0 top-full bg-white shadow-luxury-xl border-t-2 border-rosegold-400 z-50"
            onMouseEnter={keepMegaOpen}
            onMouseLeave={closeMega}
          >
            <div className="max-w-screen-2xl mx-auto px-10 py-8">
              <div className="flex gap-12">
                {/* Link sections */}
                <div className="flex gap-12 flex-1">
                  {megaMenus[activeMega].sections.map(section => (
                    <div key={section.title} className="min-w-[160px]">
                      <p className="font-inter text-[10px] font-bold tracking-[0.25em] uppercase text-rosegold-500 mb-4">
                        {section.title}
                      </p>
                      <ul className="space-y-2.5">
                        {section.links.map(link => (
                          <li key={link.label}>
                            <Link
                              to={link.href}
                              onClick={() => setActiveMega(null)}
                              className="group flex items-center gap-2 font-inter text-sm text-navy-700 hover:text-rosegold-500 transition-colors duration-150"
                            >
                              <span className="w-0 h-px bg-rosegold-400 group-hover:w-4 transition-all duration-200" />
                              {link.label}
                              {'isNew' in link && link.isNew && (
                                <span className="text-[9px] font-bold bg-rosegold-500 text-white px-1.5 py-0.5 rounded-sm tracking-wide">
                                  NEW
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Featured images */}
                <div className="flex gap-4 flex-shrink-0">
                  {megaMenus[activeMega].featured.map(feat => (
                    <Link
                      key={feat.title}
                      to={feat.href}
                      onClick={() => setActiveMega(null)}
                      className="group relative w-40 overflow-hidden rounded-sm shadow-card hover:shadow-card-hover transition-all duration-300"
                    >
                      <div className="aspect-[3/4]">
                        <img
                          src={feat.image}
                          alt={feat.title}
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="font-inter text-xs font-semibold text-white leading-tight">
                            {feat.title}
                          </p>
                          <p className="font-inter text-[10px] text-rosegold-300 mt-0.5 group-hover:underline">
                            Shop →
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Search Bar ──────────────────────────────────────────────────────── */}
        {searchOpen && (
          <div className="absolute left-0 right-0 top-full bg-white border-t border-rosegold-100 shadow-luxury-lg z-50">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
              <div className="relative max-w-2xl mx-auto">
                <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-rosegold-400" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search suits, kurtas, silk, wedding..."
                  className="w-full pl-11 pr-10 py-4 border-0 border-b-2 border-rosegold-200 font-inter text-base text-navy-700 bg-transparent focus:outline-none focus:border-rosegold-500 placeholder:text-gray-300 transition-all"
                />
                {searchQuery ? (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy-700">
                    <X size={16} />
                  </button>
                ) : (
                  <button onClick={() => setSearchOpen(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy-700">
                    <X size={16} />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                <span className="text-xs font-inter text-gray-400 mr-1 self-center">Popular:</span>
                {['Cotton Suits', 'Anarkali', 'Silk Saree', 'Party Wear', 'Wedding', 'Festive'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-3 py-1.5 text-xs font-inter font-medium text-navy-700 bg-cream-100 border border-rosegold-100 rounded-full hover:bg-rosegold-500 hover:text-white hover:border-rosegold-500 transition-all duration-200"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── Mobile Drawer ──────────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[320px] bg-white shadow-luxury-xl flex flex-col">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-rosegold-100">
              <img src="/assets/images/sitaravastram_logo.webp" alt="Sitara Vastram" className="h-10 w-auto" />
              <button onClick={() => setMobileOpen(false)} className="p-2 text-navy-700 hover:text-rosegold-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Mobile Currency */}
            <div className="px-5 py-3 border-b border-rosegold-50 bg-cream-100">
              <p className="text-[10px] font-inter text-gray-400 uppercase tracking-widest mb-2">Currency</p>
              <div className="flex flex-wrap gap-2">
                {currencies.map(c => (
                  <button
                    key={c.code}
                    onClick={() => handleCurrencySelect(c)}
                    className={`px-3 py-1.5 text-xs font-inter font-semibold rounded-sm border transition-all ${selectedCurrency.code === c.code ? 'bg-navy-700 text-white border-navy-700' : 'bg-white text-navy-700 border-rosegold-200 hover:border-rosegold-500'}`}
                  >
                    {c.flag} {c.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Nav items */}
            <div className="flex-1 overflow-y-auto py-3 px-4 scrollbar-hide">
              {([...leftNavItems, 'Sale'] as const).map(key => {
                const hasMega = key in megaMenus;
                const isExpanded = mobileExpandedItem === key;
                return (
                  <div key={key} className="mb-1">
                    <button
                      onClick={() => setMobileExpandedItem(isExpanded ? null : key)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-sm text-sm font-inter font-medium transition-colors ${key === 'Sale' ? 'text-red-500' : 'text-navy-700'} hover:bg-cream-100 hover:text-rosegold-500`}
                    >
                      {key}
                      {hasMega && <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />}
                    </button>
                    {hasMega && isExpanded && key !== 'Sale' && (
                      <div className="ml-4 border-l-2 border-rosegold-200/50 pl-4 pb-2">
                        {megaMenus[key as MegaMenuKey].sections.map(section => (
                          <div key={section.title} className="mt-2 mb-3">
                            <p className="text-[10px] font-inter font-bold text-rosegold-400 uppercase tracking-widest mb-1.5">{section.title}</p>
                            {section.links.map(link => (
                              <Link
                                key={link.label}
                                to={link.href}
                                className="block py-1.5 text-xs font-inter text-gray-600 hover:text-rosegold-500 transition-colors"
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="px-5 pb-8 pt-4 border-t border-rosegold-100 space-y-3">
              <Link to="/account" className="btn-primary w-full text-center block text-sm">
                My Account
              </Link>
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 text-sm font-inter text-navy-700 justify-center hover:text-rosegold-500 transition-colors"
              >
                <Phone size={15} />
                +91 98765 43210
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Click-outside to close currency / mega */}
      {(currencyOpen || activeMega) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => { setCurrencyOpen(false); setActiveMega(null); }}
        />
      )}
    </>
  );
}
