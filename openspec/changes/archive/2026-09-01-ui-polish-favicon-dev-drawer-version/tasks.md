## 1. Optimize favicon SVG

- [x] 1.1 Replace `src/app/favicon.svg` with an optimized otter mark: reduce viewBox to 32×32, use explicit hex colors (`#061826` for dark elements, `#D9FBFF` for light elements), simplify mouth geometry, ensure eye circles ≥2px and nose ≥3px for legibility at 16–32px
- [x] 1.2 Verify favicon renders correctly in browser tab icon, taskbar shortcut, and mobile home screen bookmark

## 2. Add OK button to Dev Drawer

- [x] 2.1 Import `DialogFooter` from `@base-ui/react/dialog` (or use existing dialog component's footer) in `src/components/dev-drawer/DevDrawer.tsx`
- [x] 2.2 Add a `<DialogFooter>` section below the cache management area with an "OK" button that closes the dialog via `onOpenChange={setOpen}` or `DialogPrimitive.Close`
- [x] 2.3 Style the OK button to match existing dev drawer buttons (variant: default/primary, size: sm)

## 3. Remove redundant search results subheading text

- [x] 3.1 In `src/app/search/page.tsx`, remove "Results for 'Profession'" from the `<p>` element while retaining provider badge and cache/latency metrics
- [x] 3.2 Verify the profession heading (`<h2>`) and metrics badge row below it still render correctly after removal

## 4. Version bump

- [x] 4.1 Update `package.json` version field from `"0.4.0"` to `"0.4.1"`

## 5. Validation

- [x] 5.1 Run `npx eslint . --ext .ts,.tsx` and fix any lint errors
- [x] 5.2 Run `npm run build && npm start` to verify production build succeeds with no regressions (pre-existing TS errors in base code block full build; no new errors introduced)
