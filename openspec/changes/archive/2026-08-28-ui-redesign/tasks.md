# Tasks — UI Redesign (v0.3.1)

## 1. Theme Color Palettes

- [x] 1.1 Replace `:root` CSS variables in `src/app/globals.css` with Capuccino palette (Linen `#f5f1ea`, Khaki `#d7c9b8`, Camel `#82967d`, Cocoa `#7d5a44`, Espresso `#4a342a`)
- [x] 1.2 Replace `.dark` CSS variables in `src/app/globals.css` with Aurora Borealis palette (`#061826`, `#0B2C3C`, `#D9FBFF`)
- [x] 1.3 Verify all color combinations meet WCAG AA contrast ratios for body text and headings in both modes

## 2. Otter Icon and Logo Link

- [x] 2.1 Create inline SVG otter face icon (square format, ~40x40px) in `src/components/auth/header.tsx`
- [x] 2.2 Wrap the combined icon + "Smart Otter" text in `<Link href="/">` element
- [x] 2.3 Style icon to inherit theme color via `currentColor`

## 3. Header Layout Reorganization

- [x] 3.1 Move ThemeToggle from left nav (`<nav>` section) to right-side controls, between DevDrawer and ClientAuth in `src/components/auth/header.tsx`
- [x] 3.2 Left nav now contains only: logo+icon link + Search link
- [x] 3.3 Right nav now contains (in order): DevDrawer → ThemeToggle → ClientAuth

## 4. Profession Name Heading on Results Page

- [x] 4.1 Add `<h2 className="text-xl font-semibold mb-6">` with capitalized profession name in `src/app/search/page.tsx`, placed after metrics line and before category carousels
- [x] 4.2 Wrap heading inside `{hasResults && results && (...)}` conditional so it only shows when results exist

## 5. Status Indicator Relocation to Dev Drawer

- [x] 5.1 Remove `SearchStatusWidget` import from `src/app/search/page.tsx`
- [x] 5.2 Remove `<SearchStatusWidget />` DOM node and its surrounding `<div>` from search page
- [x] 5.3 Import `SearchStatusWidget` into `src/components/dev-drawer/DevDrawer.tsx`
- [x] 5.4 Add status indicator section inside DevDrawer, positioned below provider selection options and above cache management controls

## 6. Card Height Increase

- [x] 6.1 Update `ResourceCard.tsx`: change explanation `<p>` from `line-clamp-2` to `line-clamp-4`
- [x] 6.2 Add `h-[260px] flex flex-col justify-between` to the card container `<div>` in `ResourceCard.tsx` (fixed height with flexbox for uniform card alignment)
- [x] 6.3 Update skeleton placeholder height in `src/app/search/page.tsx` from `h-[180px]` to `h-[260px]`

## 7. Version Bump and Verification

- [x] 7.1 Increment version in `package.json` from `0.3.0` to `0.3.1`
- [x] 7.2 Run `npx eslint . --ext .ts,.tsx` — verify no lint errors
- [x] 7.3 Run `npx vitest` — verify all tests pass (no behavior changes expected)
