import React, { useState, useEffect } from "react";
import Card from "./Card";
import Button from "./Button";
import Search from "./Search";

const CardList = ({ data }) => {
  // Define the limit state variable and set it to 10
  const limit = 10;
  
  // Define the default dataset, using slice to get the first 10 products
  const defaultDataset = data.slice(0, limit);
  
  // Define the offset state variable and set it to 0
  const [offset, setOffset] = useState(0);
  
  // Define the products state variable and set it to the default dataset
  const [products, setProducts] = useState(defaultDataset);
  
  // State to hold filtered data
  const [filteredData, setFilteredData] = useState(data);

  // Define a unified pagination handler
  const handlePagination = (direction) => {
    if (direction === 'next') {
      setOffset(offset + limit);
    } else if (direction === 'previous') {
      setOffset(offset - limit);
    }
  };

  // Define the filterTags function
  const filterTags = (searchTerm) => {
    // If search term is empty, reset to all data
    if (!searchTerm || searchTerm.trim() === '') {
      setFilteredData(data);
      setOffset(0);
      return;
    }

    // Filter the data by tags
    const filtered = data.filter((product) => {
      // Check if product has tags array
      if (product.tags && Array.isArray(product.tags)) {
        // Check if any tag matches the search term
        return product.tags.some((tag) => {
          // Handle both string tags and object tags with title property
          const tagTitle = typeof tag === 'string' ? tag : tag.title;
          return tagTitle && tagTitle.toLowerCase().includes(searchTerm);
        });
      }
      return false;
    });

    // Update the filtered data and reset offset
    setFilteredData(filtered);
    setOffset(0);
  };

  // Define the useEffect hook
  // This hook will run every time the offset, limit, or filteredData state variables change
  // It will update the products state variable to the next set of products
  useEffect(() => {
    setProducts(filteredData.slice(offset, offset + limit));
  }, [offset, limit, filteredData]);

  // Check if we're at the end of the products list
  const isAtEnd = offset + limit >= filteredData.length;

  return (
    <div className="cf pa2">
      {/* Search Component */}
      <Search handleSearch={filterTags} />

      <div className="mt2 mb2">
        {/* Using the products state, map over the list of products and render a Card component for each product */}
        {products.map((product) => (
          <Card key={product.id} {...product} />
        ))}
      </div>
      
      {/* Pagination Buttons */}
      <div className="flex items-center justify-center pa4">
        {offset > 0 && (
          <Button text="Previous" handleClick={() => handlePagination('previous')} />
        )}
        {!isAtEnd && (
          <Button text="Next" handleClick={() => handlePagination('next')} />
        )}
      </div>
    </div>
  );
};

export default CardList;