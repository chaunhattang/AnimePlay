# Frontend UI Enhancement TODO

## Phase 1: Foundation (CSS + Config)

- [x] Update `tailwind.config.ts` with custom animations, colors, shadows
- [x] Update `globals.css` with animation utilities, scrollbar, skeleton styles

## Phase 2: Reusable Components

- [x] Create `components/FormField.tsx` - labeled input with floating animation

## Phase 3: Auth Pages

- [x] Update `app/login/page.tsx` - labels, animations, visual polish
- [x] Update `app/register/page.tsx` - labels, animations, visual polish

## Phase 4: Admin Pages

- [x] Update `app/admin/page.tsx` - card hover animations
- [x] Update `app/admin/movies/page.tsx` - labels for all inputs, accordion animation
- [x] Update `app/admin/users/page.tsx` - labels for all inputs, row hover effects

## Phase 5: Movie & Browse Experience

- [ ] Update `components/MovieCard.tsx` - hover scale, lift, glow, image zoom
- [ ] Update `components/MovieGrid.tsx` - staggered fade-in, empty state
- [ ] Update `components/HeroSection.tsx` - text slide-up, button pulse glow
- [ ] Update `app/movies/page.tsx` - loading skeleton, pagination effects
- [ ] Update `app/movies/[id]/page.tsx` - poster scale-in, content stagger

## Phase 6: Shared Components

- [ ] Update `components/Header.tsx` - link hover underline, logo pulse
- [ ] Update `components/Footer.tsx` - fade-in, link hover effects
- [ ] Update `components/SearchBar.tsx` - focus ring expansion, icon pulse
- [ ] Update `components/GenreFilter.tsx` - custom styled select
- [ ] Update `components/WatchlistButton.tsx` - heart pop animation

## Phase 7: Other Pages

- [ ] Update `app/page.tsx` - skeleton loader, section stagger
- [ ] Update `components/ClientWatchlistPage.tsx` - empty state animation
- [ ] Update `app/not-found.tsx` - bounce animation, improved design

## Testing

- [ ] Run `npm run dev` and verify compilation
- [ ] Visual inspection of all key pages
