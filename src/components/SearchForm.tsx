'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

interface SearchFormProps {
  defaultValue?: string
  className?: string
  placeholder?: string
}

export function SearchForm({
  defaultValue = '',
  className = '',
  placeholder = 'Search...',
}: SearchFormProps) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`flex items-center ${className}`}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="px-3 py-1 bg-gray-800 border-2 border-gray-700 text-gray-300 rounded-l 
                   focus:outline-none focus:border-green-400 transition-colors
                   font-mono text-sm"
      />
      <button
        type="submit"
        className="px-3 py-1 bg-gray-700 border-2 border-l-0 border-gray-700 
                   hover:bg-gray-600 text-green-400 rounded-r transition-colors
                   font-mono text-sm font-bold"
      >
        SEARCH
      </button>
    </form>
  )
}
