import React, { useState, useRef, useCallback } from 'react'
import useBookSearch from './useBookSearch'

export default function App() {
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)

  const {
    books,
    hasMore,
    loading,
    error
  } = useBookSearch(query, pageNumber)

  const observer = useRef();

  const lastBookElementRef = useCallback(node => {
       // console.log(observer);
    if (loading) 
      return
    if (observer.current) 
      observer.current.disconnect()
    
      observer.current = new IntersectionObserver(entries => {   
        console.log("Interseting");   
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    });

    if (node){
      console.log("start to observe");
      observer.current.observe(node);  // here it starts observing
    }
  }, [loading, hasMore])

  function handleSearch(e) {
    setQuery(e.target.value)
    setPageNumber(1)
  }

  return (
    <>
      <input type="text" value={query} onChange={handleSearch}></input>
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return <div ref={lastBookElementRef} key={book}>{book}</div>
        } else {
          return <div key={book}>{book}</div>
        }
      })}
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
    </>
  )
}

