# Mini File Explorer

A lightweight, browser-based file explorer built with Next.js. It simulates a real-world hierarchical file system with folders and text files, supporting creation, editing, renaming, deletion, and navigation. The project focuses on clean architecture, reusable components, and a scalable state management approach.

---

## Tech Stack

* Next.js 16.2.6
* TypeScript
* Tailwind CSS
* Lucide React

---

## Features

* Hierarchical folder and file structure (recursive tree)
* Create folders and text files inside any directory
* Rename files and folders
* Delete files and folders (recursive deletion supported)
* Expand and collapse folders in sidebar tree view
* Breadcrumb navigation for easy traversal
* Main panel view with grid and list modes
* Text file editor with:

  * Line numbers
  * Keyboard shortcuts (Ctrl + S to save, Tab indentation)
* Persistent state using localStorage
* Responsive UI with mobile sidebar support
* Clean dark theme (Catppuccin inspired)

---

## Project Structure

```
├── types/index.ts
│   → Shared TypeScript types for files, folders, and state

├── utils/fileSystem.ts
│   → Mock data and helper utilities for file operations

├── hooks/useFileSystem.ts
│   → Central state management using useReducer

├── components/
│   ├── FileExplorer.tsx
│   │   → Main container that orchestrates sidebar and main panel

│   ├── Sidebar/
│   │   ├── Sidebar.tsx
│   │   │   → Tree container for folder structure
│   │   └── TreeNode.tsx
│   │       → Recursive node renderer for folders/files

│   ├── MainPanel/
│   │   ├── MainPanel.tsx
│   │   │   → Breadcrumb + content view controller
│   │   ├── FileItem.tsx
│   │   │   → File/folder card UI
│   │   └── TextEditor.tsx
│   │       → Editor for text files with advanced interactions

│   ├── Modals/
│   │   ├── CreateModal.tsx
│   │   ├── RenameModal.tsx
│   │   └── DeleteModal.tsx
│   │       → Modal dialogs for CRUD operations

│   └── ui/
│       └── Modal.tsx
│           → Reusable modal wrapper component
```

---

## Architecture Overview

The application is built around a centralized state model using `useReducer`, where the entire file system is treated as a tree structure.

* Each node represents either a folder or a text file
* Folders can contain nested children recursively
* All mutations (create, rename, delete, update content) flow through a single reducer
* UI components are fully decoupled and consume state via custom hooks

This ensures predictable state transitions and maintainable scalability.

---

## Core Functionalities

### File System Operations

* Create new folders or text files inside any directory
* Rename existing nodes
* Delete nodes recursively (folders delete all nested contents)

### Navigation

* Sidebar tree view with expand/collapse support
* Click to navigate between folders
* Breadcrumb trail for current location tracking

### Text File Editor

* Inline editor for text files
* Line numbers for better readability
* Keyboard shortcuts:

  * Ctrl + S → Save content
  * Tab → Indent support

### View Modes

* Grid view for visual browsing
* List view for compact navigation

---

## State Management

All file system logic is handled using a custom hook:

* `useFileSystem.ts`

  * Manages tree structure
  * Handles all CRUD operations
  * Syncs with localStorage for persistence

This avoids external state libraries and keeps logic isolated and testable.

---

## Persistence

The entire file system state is stored in `localStorage`, allowing:

* Data persistence across page reloads
* Instant restore of last session state
* No backend dependency

---

## UI & Responsiveness

* Fully responsive layout
* Sidebar collapses into mobile-friendly drawer
* Clean dark theme inspired by Catppuccin palette
* Smooth transitions for expand/collapse and modals

---

## Key Design Decisions

* Recursive tree structure for natural file system modeling
* Centralized reducer-based state for predictable updates
* Modular component separation for reusability
* Minimal external dependencies to keep bundle lightweight
* LocalStorage used instead of backend for simplicity and performance

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Future Improvements

* Drag and drop file/folder reordering
* Search functionality inside file system
* Multi-tab file editing
* Undo/redo system for file operations
* Backend integration for cloud persistence

---

## Author

Built as a frontend engineering exercise focusing on scalable UI architecture, state management, and clean component design.
