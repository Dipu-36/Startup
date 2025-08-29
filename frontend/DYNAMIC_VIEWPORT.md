# Dynamic Viewport Implementation

This implementation provides comprehensive support for dynamic viewport units to ensure proper rendering across different devices and screen sizes, especially mobile devices with dynamic browser UI.

## 🎯 Problem Solved

Mobile browsers have dynamic UI elements (address bars, navigation bars) that can show/hide, changing the viewport height. Traditional `100vh` can cause layout issues because it doesn't account for these UI changes.

## 🔧 Implementation Components

### 1. CSS Custom Properties (`index.css`)
```css
:root {
  --vh: 1vh;  /* Fallback for older browsers */
  --dvh: 1dvh; /* Dynamic viewport height */
}
```

### 2. JavaScript Viewport Calculator (`index.tsx`)
- Calculates actual viewport height
- Updates CSS custom property `--vh`
- Handles resize, orientation change, focus events
- Provides fallback for older browsers

### 3. Tailwind CSS Utilities (`tailwind.config.js`)
```javascript
height: {
  'screen-dynamic': 'calc(var(--vh, 1vh) * 100)',
  'screen-dvh': '100dvh',
  'screen-svh': '100svh',
  'screen-lvh': '100lvh',
}
```

### 4. React Hook (`useDynamicViewport.ts`)
- Provides viewport dimensions in React components
- Detects mobile viewport
- Detects browser UI visibility

### 5. Updated Viewport Meta Tag
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
```

## 📱 Available Tailwind Classes

### Height Classes
- `h-screen-dynamic` - Uses calc(var(--vh) * 100)
- `h-screen-dvh` - Uses 100dvh (modern browsers)
- `h-screen-svh` - Uses 100svh (small viewport height)
- `h-screen-lvh` - Uses 100lvh (large viewport height)

### Min-Height Classes
- `min-h-screen-dynamic` - Dynamic minimum height
- `min-h-screen-dvh` - Modern browser dynamic height
- `min-h-screen-svh` - Small viewport minimum height
- `min-h-screen-lvh` - Large viewport minimum height

### Max-Height Classes
- `max-h-screen-dynamic` - Dynamic maximum height
- `max-h-screen-dvh` - Modern browser maximum height
- `max-h-screen-svh` - Small viewport maximum height
- `max-h-screen-lvh` - Large viewport maximum height

## 🚀 Usage Examples

### Basic Component Layout
```tsx
<div className="min-h-screen-dynamic bg-background">
  {/* Content that fills the dynamic viewport */}
</div>
```

### Using the React Hook
```tsx
import { useDynamicViewport, useIsMobile } from '../hooks/useDynamicViewport';

function MyComponent() {
  const { width, height, dynamicHeight } = useDynamicViewport();
  const isMobile = useIsMobile();
  
  return (
    <div style={{ minHeight: dynamicHeight }}>
      {/* Component content */}
    </div>
  );
}
```

### Detecting Mobile Browser UI
```tsx
import { useMobileBrowserUI } from '../hooks/useDynamicViewport';

function MyComponent() {
  const hasBrowserUI = useMobileBrowserUI();
  
  return (
    <div className={hasBrowserUI ? 'with-browser-ui' : 'full-viewport'}>
      {/* Adjust layout based on browser UI visibility */}
    </div>
  );
}
```

## 🌐 Browser Support

### Modern Browsers (Recommended)
- Chrome 108+, Firefox 101+, Safari 15.4+
- Uses native `dvh`, `svh`, `lvh` units
- Automatic handling of dynamic browser UI

### Legacy Browsers (Fallback)
- Uses JavaScript-calculated `--vh` custom property
- Fallback to traditional `vh` units
- Event-based viewport height updates

## 📐 Viewport Unit Types

### `dvh` (Dynamic Viewport Height)
- Adjusts to actual available space
- Accounts for browser UI changes
- **Best for**: Full-screen layouts

### `svh` (Small Viewport Height)
- Uses minimum possible viewport height
- Assumes browser UI is visible
- **Best for**: Conservative layouts

### `lvh` (Large Viewport Height)
- Uses maximum possible viewport height
- Assumes browser UI is hidden
- **Best for**: Immersive experiences

### `vh` (Traditional Viewport Height)
- Fixed 1% of initial viewport height
- Doesn't account for browser UI changes
- **Best for**: Desktop-only layouts

## 🔄 Event Handling

The implementation automatically updates viewport calculations on:
- **Window resize** - Screen rotation, window size changes
- **Orientation change** - Mobile device rotation
- **Window focus** - Browser UI show/hide on mobile
- **Page load** - Initial calculation

## ✅ Components Updated

All major components now use dynamic viewport:
- ✅ `CreateCampaign.tsx`
- ✅ `BrandDashboard.tsx`
- ✅ `LandingPage.tsx`
- ✅ `LoginPage.tsx`
- ✅ `SignupPage.tsx`

## 🎨 CSS Fallback Strategy

```css
/* Progressive enhancement */
.element {
  height: 100vh;                    /* Fallback for old browsers */
  height: calc(var(--vh) * 100);    /* JavaScript-calculated */
  height: 100dvh;                   /* Modern browsers */
}
```

## 🧪 Testing

Test the implementation across:
- **Mobile Chrome/Safari** - Dynamic address bar
- **Mobile Firefox** - Different UI behavior
- **Tablet devices** - Orientation changes
- **Desktop browsers** - Standard viewport
- **PWA mode** - Full-screen behavior

## 🔧 Troubleshooting

### Issue: Layout jumps on mobile
**Solution**: Use `min-h-screen-dynamic` instead of `h-screen-dynamic`

### Issue: Content cut off
**Solution**: Use `svh` units for conservative layouts

### Issue: Too much white space
**Solution**: Use `lvh` units for immersive experiences

### Issue: Older browser compatibility
**Solution**: JavaScript fallback automatically handles this
