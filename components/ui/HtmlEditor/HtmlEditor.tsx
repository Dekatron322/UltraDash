"use client"

import React, { useRef, useCallback, useState } from "react"
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
} from "react-icons/md"

interface HtmlEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
}

const HtmlEditor: React.FC<HtmlEditorProps> = ({ value, onChange, placeholder, className = "" }) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  const executeCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Let the browser handle Enter key naturally for better text input
    if (e.key === 'Enter') {
      // Allow default behavior but trigger onChange after
      setTimeout(() => {
        if (editorRef.current) {
          onChange(editorRef.current.innerHTML)
        }
      }, 0)
    }
  }, [onChange])

  const toolbarButtons = [
    { command: 'bold', icon: MdFormatBold, title: 'Bold' },
    { command: 'italic', icon: MdFormatItalic, title: 'Italic' },
    { command: 'underline', icon: MdFormatUnderlined, title: 'Underline' },
    { command: 'insertUnorderedList', icon: MdFormatListBulleted, title: 'Bullet List' },
    { command: 'insertOrderedList', icon: MdFormatListNumbered, title: 'Numbered List' },
    { command: 'justifyLeft', icon: MdFormatAlignLeft, title: 'Align Left' },
    { command: 'justifyCenter', icon: MdFormatAlignCenter, title: 'Align Center' },
    { command: 'justifyRight', icon: MdFormatAlignRight, title: 'Align Right' },
  ]

  return (
    <div className={`border rounded-md ${isFocused ? 'ring-2 ring-[#003F9F]' : 'border-gray-300'} ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        {toolbarButtons.map(({ command, icon: Icon, title }) => (
          <button
            key={command}
            type="button"
            onClick={() => executeCommand(command)}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title={title}
          >
            <Icon className="w-4 h-4 text-gray-600" />
          </button>
        ))}
        
        {/* Font Size */}
        <select
          onChange={(e) => executeCommand('fontSize', e.target.value)}
          className="ml-2 px-2 py-1 text-sm border border-gray-300 rounded"
          defaultValue="3"
        >
          <option value="1">Small</option>
          <option value="3">Normal</option>
          <option value="5">Large</option>
          <option value="7">Extra Large</option>
        </select>

        {/* Text Color */}
        <input
          type="color"
          onChange={(e) => executeCommand('foreColor', e.target.value)}
          className="ml-2 w-8 h-8 border border-gray-300 rounded cursor-pointer"
          title="Text Color"
        />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        dangerouslySetInnerHTML={{ __html: value }}
        className="min-h-[120px] p-3 focus:outline-none"
        style={{ 
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          direction: 'ltr',
          unicodeBidi: 'normal'
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      {/* Placeholder styling */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}

export default HtmlEditor
