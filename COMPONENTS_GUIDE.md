# Components & UI Configuration Guide

Complete guide to the new reusable components and UI configuration system.

---

## 📋 Overview

We've created a **configurable, reusable component system** with:
- ✅ Centralized UI text configuration
- ✅ Reusable Button component
- ✅ Reusable Input component
- ✅ Loading spinner variants
- ✅ Local storage hooks
- ✅ Fully accessible & responsive

---

## 🎯 UI Configuration (`src/config/ui.config.js`)

**Centralized configuration for ALL UI text** - change once, applies everywhere.

### Usage

```javascript
import { UI_CONFIG, getUIText, interpolate } from '@/config/ui.config';

// Get text
const title = UI_CONFIG.AUTH.LOGIN.TITLE;
// or use helper
const title = getUIText('AUTH.LOGIN.TITLE');

// Interpolate variables
const message = interpolate('Welcome {name}!', { name: 'John' });
```

### Sections

```javascript
UI_CONFIG.AUTH.LOGIN              // All login page text
UI_CONFIG.AUTH.SIGNUP             // All signup page text
UI_CONFIG.UPLOAD                  // Upload page text
UI_CONFIG.FILES                   // Browse/Files page text
UI_CONFIG.FILE_CARD               // File card component text
UI_CONFIG.NAV                     // Navigation text
UI_CONFIG.BUTTONS                 // Common button text
UI_CONFIG.VALIDATION              // Validation messages
UI_CONFIG.STATUS                  // Status messages
UI_CONFIG.EMPTY_STATES            // Empty state messages
UI_CONFIG.MODALS                  // Modal/dialog text
UI_CONFIG.LOADING                 // Loading state messages
UI_CONFIG.ERRORS                  // Error messages
UI_CONFIG.PROFILE                 // Profile page text
UI_CONFIG.LANDING                 // Landing page text
```

### Quick Edit Example

**Before**: Button text hardcoded in component
```jsx
<button>{loading ? 'Signing in...' : 'Sign In'}</button>
```

**After**: Text comes from config
```jsx
const LOGIN_UI = UI_CONFIG.AUTH.LOGIN;
<Button loading={loading}>
  {loading ? LOGIN_UI.SUBMITTING_BTN : LOGIN_UI.SUBMIT_BTN}
</Button>
```

---

## 🔘 Button Component

**Reusable, accessible button with multiple variants and sizes.**

### Location
`src/components/Button/Button.jsx`
`src/components/Button/Button.css`

### Basic Usage

```jsx
import Button from '@/components/Button/Button';

<Button>Click me</Button>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | string/node | - | Button content |
| `label` | string | - | Alternative to children |
| `variant` | string | 'primary' | 'primary', 'secondary', 'danger', 'ghost' |
| `size` | string | 'md' | 'sm', 'md', 'lg' |
| `fullWidth` | bool | false | Stretch to 100% width |
| `loading` | bool | false | Show loading spinner |
| `disabled` | bool | false | Disable button |
| `onClick` | func | - | Click handler |
| `type` | string | 'button' | 'button', 'submit', 'reset' |
| `icon` | component | - | Icon component (react-icons) |
| `title` | string | - | Tooltip/title |
| `ariaLabel` | string | - | Accessibility label |
| `className` | string | '' | Additional CSS classes |

### Examples

```jsx
// Primary button
<Button variant="primary">Save</Button>

// Secondary button
<Button variant="secondary">Cancel</Button>

// Danger button
<Button variant="danger">Delete</Button>

// Ghost button (outline)
<Button variant="ghost">Learn More</Button>

// Large button with icon
import { FiDownload } from 'react-icons/fi';
<Button size="lg" icon={FiDownload}>Download</Button>

// Loading state
<Button loading>Uploading...</Button>

// Full width
<Button fullWidth variant="primary">Submit</Button>

// Disabled
<Button disabled>Disabled</Button>

// With title/tooltip
<Button title="Click to continue">Next</Button>
```

### Variants

**Primary** (filled, dark)
- Default for main actions
- Use for submit, save, login

**Secondary** (outlined)
- For secondary actions
- Use for cancel, back, skip

**Danger** (warning color)
- For destructive actions
- Use for delete, remove

**Ghost** (transparent)
- For tertiary actions
- Use for links, minor actions

### Sizes

**Small (sm)**
- 36px height
- Compact UI

**Medium (md)** *(default)*
- 44px height (iOS recommended)
- Most common

**Large (lg)**
- 52px height
- Prominent CTAs

---

## 📝 Input Component

**Reusable input field with validation, icons, and multiple variants.**

### Location
`src/components/Input/Input.jsx`
`src/components/Input/Input.css`

### Basic Usage

```jsx
import Input from '@/components/Input/Input';

<Input
  label="Email"
  type="email"
  placeholder="your@email.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | string | - | Input label |
| `placeholder` | string | - | Placeholder text |
| `type` | string | 'text' | Input type |
| `name` | string | - | Input name attribute |
| `value` | string | - | Input value |
| `error` | string | - | Error message (shows in red) |
| `disabled` | bool | false | Disable input |
| `required` | bool | false | Show required asterisk |
| `onChange` | func | - | Change handler |
| `onFocus` | func | - | Focus handler |
| `onBlur` | func | - | Blur handler |
| `onClear` | func | - | Clear handler |
| `variant` | string | 'default' | 'default', 'underline', 'filled' |
| `size` | string | 'md' | 'sm', 'md', 'lg' |
| `icon` | component | - | Left icon (react-icons) |
| `clearable` | bool | false | Show clear button |
| `maxLength` | number | - | Maximum characters |
| `helpText` | string | - | Help text below input |
| `ariaLabel` | string | - | Accessibility label |

### Examples

```jsx
import { FiMail, FiLock, FiSearch } from 'react-icons/fi';

// Basic text input
<Input 
  label="Name"
  placeholder="John Doe"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

// With icon
<Input
  label="Email"
  type="email"
  icon={FiMail}
  placeholder="user@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// Password (auto show/hide toggle)
<Input
  label="Password"
  type="password"
  icon={FiLock}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

// With error
<Input
  label="Email"
  type="email"
  value={email}
  error={errors.email}
  onChange={(e) => setEmail(e.target.value)}
/>

// With help text
<Input
  label="Username"
  helpText="3-20 characters, letters and numbers only"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>

// Clearable
<Input
  label="Search"
  icon={FiSearch}
  clearable
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  onClear={() => setSearch('')}
/>

// Different variant
<Input
  variant="underline"
  placeholder="Search..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

// Different size
<Input
  size="lg"
  label="Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

// Required field
<Input
  label="Email"
  required
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// Max length with counter
<Input
  label="Bio"
  maxLength={150}
  value={bio}
  onChange={(e) => setBio(e.target.value)}
/>
```

### Features

- **Auto show/hide** for password fields
- **Clear button** when `clearable=true`
- **Character counter** when `maxLength` set
- **Error display** in red
- **Help text** below input
- **Icons** on left and right
- **Touch friendly** on mobile

### Variants

**Default**
- Border on all sides
- Standard appearance

**Underline**
- Border only on bottom
- Cleaner look

**Filled**
- Light background
- Modern look

---

## ⏳ Loading Spinner Component

**Multiple loading animation variants with messages.**

### Location
`src/components/Loading/LoadingSpinner.jsx`
`src/components/Loading/LoadingSpinner.css`

### Basic Usage

```jsx
import LoadingSpinner from '@/components/Loading/LoadingSpinner';

<LoadingSpinner message="Loading files..." />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | string | - | Loading message text |
| `variant` | string | 'spinner' | 'spinner', 'dots', 'bar', 'skeleton' |
| `size` | string | 'md' | 'sm', 'md', 'lg' |
| `fullScreen` | bool | false | Cover entire screen |
| `icon` | component | - | Custom icon |
| `className` | string | '' | Additional classes |

### Examples

```jsx
// Spinner (default)
<LoadingSpinner message="Loading..." />

// Dots animation
<LoadingSpinner variant="dots" message="Processing..." />

// Progress bar
<LoadingSpinner variant="bar" message="Uploading..." />

// Full screen overlay
<LoadingSpinner 
  fullScreen 
  message="Please wait..." 
/>

// Different size
<LoadingSpinner 
  variant="spinner" 
  size="lg" 
  message="Large spinner"
/>

// Without message
<LoadingSpinner variant="dots" />

// With custom icon
import { FiUpload } from 'react-icons/fi';
<LoadingSpinner 
  icon={FiUpload}
  message="Uploading file..."
/>
```

### Skeleton Loader

For showing placeholder content while loading:

```jsx
import { SkeletonLoader } from '@/components/Loading/LoadingSpinner';

// Multiple card skeletons
<SkeletonLoader type="card" count={3} height="150px" />

// Text lines
<SkeletonLoader type="text" count={5} />

// Single line
<SkeletonLoader type="line" count={1} />

// Circular skeleton (profile pic)
<SkeletonLoader type="circle" count={1} height="100px" />
```

---

## 🎣 Local Storage Hooks

**Custom hooks for managing localStorage and sessionStorage with React state.**

### Location
`src/hooks/useLocalStorage.js`

### useLocalStorage

Persist data to localStorage:

```jsx
import { useLocalStorage } from '@/hooks/useLocalStorage';

const [name, setName, removeName] = useLocalStorage('userName', 'Guest');

// Use like state
const handleSave = () => setName('John');
const handleClear = () => removeName(); // Clears from storage
```

### useLocalStorageSync

Sync localStorage across browser tabs:

```jsx
const [theme, setTheme] = useLocalStorageSync('theme', 'light');

// Change in one tab, updates in all tabs automatically
```

### useSessionStorage

Similar to useLocalStorage but for sessionStorage (cleared on page close):

```jsx
import { useSessionStorage } from '@/hooks/useLocalStorage';

const [tempData, setTempData, removeTempData] = useSessionStorage('temp', null);
```

### Examples

```jsx
// Remember user preferences
export function ThemeSwitcher() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}

// Remember form data
export function MyForm() {
  const [formData, setFormData] = useLocalStorage('formData', {});

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <form>
      {/* Form fields auto-saved */}
    </form>
  );
}

// Remember auth token
export function Login() {
  const [token, setToken, removeToken] = useLocalStorage('authToken', null);

  const handleLogin = async (credentials) => {
    const response = await fetch('/login', { body: credentials });
    const { token } = await response.json();
    setToken(token); // Persisted automatically
  };

  const handleLogout = () => {
    removeToken(); // Clear from storage
  };

  return (
    <>
      {/* Login form or user panel */}
    </>
  );
}
```

---

## 📱 Responsive Design

All components are **mobile-first responsive**:

### Breakpoints

```
Mobile:  320px - 767px     (1 column, full-width)
Tablet:  768px - 1023px    (2 columns, side menus)
Desktop: 1024px - 1439px   (3 columns, sidebars)
Wide:    1440px+           (4 columns, full layout)
```

### Touch Friendly

- Minimum 48px buttons
- 16px min touch targets
- Proper spacing on mobile
- Optimized forms

---

## ♿ Accessibility

All components include:

- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Error announcements
- ✅ Semantic HTML
- ✅ Color contrast

---

## 🎨 Customization

### Change colors

Edit `src/styles/variables.css`:

```css
:root {
    --kh-accent: #111111;      /* Main color */
    --kh-text: #111111;        /* Text color */
    --kh-border: rgba(...);    /* Border color */
}
```

### Change fonts

Edit `src/styles/variables.css`:

```css
--kh-font-display: "Your Font";
--kh-font-body: "Your Font";
```

### Add new variant

Edit component CSS file:

```css
.btn-custom {
    background-color: #custom-color;
    color: #custom-text;
}
```

---

## 🔄 Migration Guide

### From PrimeReact to New Components

**Before:**
```jsx
import { InputText } from "primereact/inputtext";
<InputText value={email} onChange={(e) => setEmail(e.target.value)} />
```

**After:**
```jsx
import Input from '@/components/Input/Input';
<Input value={email} onChange={(e) => setEmail(e.target.value)} />
```

### Benefits

✅ Smaller bundle size
✅ Fully customizable
✅ Better performance
✅ Consistent branding
✅ No external dependencies

---

## 📚 Component Composition

### Form with validation

```jsx
function MyForm() {
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    // validation logic
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // submit logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Name"
        value={data.name}
        error={errors.name}
        onChange={(e) => setData({...data, name: e.target.value})}
      />
      
      <Button
        type="submit"
        loading={loading}
        fullWidth
      >
        Submit
      </Button>
    </form>
  );
}
```

---

## 🚀 Best Practices

1. **Always use UI_CONFIG** for text
2. **Use Icons from react-icons** for consistency
3. **Test accessibility** with keyboard navigation
4. **Use loading states** for better UX
5. **Handle errors gracefully** with error messages
6. **Remember user data** with localStorage
7. **Provide feedback** with toast notifications
8. **Keep component logic simple** - move complex logic to hooks

---

## 🎯 Next Steps

1. Update all pages to use new components
2. Remove PrimeReact dependencies
3. Test on mobile devices
4. Gather user feedback
5. Iterate and improve

---

**Last Updated**: 2024-11-27
**Version**: 1.0.0
**Status**: Ready for Implementation
