# Cursor Rules

This document defines the cursor behavior rules for the AI-Powered Habit Tracker app to ensure a smooth and intuitive user experience.

---

## 1. General Cursor Behavior

- **Default Cursor:**  
  - Used on all non-interactive elements and background areas.
  - Appearance: Default arrow pointer.

- **Pointer Cursor:**  
  - Used on clickable elements such as buttons, links, habit cards, friend list items, and navigation items (including sidebar).
  - Appearance: Hand pointer.

- **Text Cursor (I-beam):**  
  - Used on all input fields, text areas, and editable text components.
  - Appearance: Vertical bar.

---

## 2. Disabled Elements

- **Disabled Buttons (e.g., Send Cheers to Self, Remove Friend when not allowed):**  
  - Cursor: `not-allowed` (circle with a line through it).
  - Tooltip explaining why the action is disabled appears on hover.
  - Visual style: Grayed out or reduced opacity.
  - **Toast notifications** are used for error feedback in addition to tooltips.

---

## 3. Loading States

- **Loading Buttons or Actions:**  
  - Cursor: `wait` (spinning wheel or hourglass).
  - Prevents multiple clicks during async operations.

---

## 4. Drag & Drop (If Implemented)

- **Draggable Items (e.g., rearranging habits):**  
  - Cursor: `grab` when hovering.
  - Cursor: `grabbing` while dragging.

---

## 5. Text Selection

- Text inside habit notes, motivational messages, and cheers should be selectable with the text cursor.

---

## 6. Accessibility Considerations

- Ensure cursor changes are accompanied by visual focus indicators for keyboard navigation.
- Do not rely solely on cursor changes to indicate interactivity.
- All interactive elements (including Friends and Habits features, sidebar navigation, and UI primitives like Button) maintain accessibility and focus indicators.
- **All feature UIs (Habits, Friends, Cheers, Sidebar, etc.) and all atomic UI primitives use these cursor and accessibility rules.**

---

## 7. UI Primitives & Consistency

- All reusable UI components (Button, Input, etc.) in `components/ui/` use the correct cursor and accessibility states.
- Friends and Habits features, as well as navigation, consistently use pointer, not-allowed, and wait cursors as appropriate.
- **Toast notifications and tooltips are used for feedback and disabled states.**
- **All feature UIs and primitives are modular and consistent across the app.**

---

## Summary Table

| Element/State               | Cursor Type   | Notes                                  |
|----------------------------|---------------|---------------------------------------|
| Default background         | default       | Non-interactive areas                  |
| Clickable buttons/links    | pointer       | Habit cards, navigation, friend items  |
| Input fields/text areas    | text          | Editable text                         |
| Disabled buttons           | not-allowed   | Disabled actions with tooltip/feedback |
| Loading actions            | wait          | Async operations                      |
| Draggable items (optional) | grab/grabbing | Drag and drop UI                      |

---

By following these cursor rules, the app will provide clear visual cues to users about interactivity and state, enhancing usability, accessibility, and consistency across all features and UI primitives.
