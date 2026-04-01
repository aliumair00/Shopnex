import React from 'react'
import { useSearchParams } from 'react-router-dom';

const SortOption = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const handleSortChange = (e) => {
    const sort = e.target.value;
    searchParams.set("sortBy", sort);
    setSearchParams(searchParams);
  }
  return (
    <div className="mb-4 flex items-center justify-end">
<select 
id="sort" 
value={searchParams.get("sortBy") || ""}
className="border p-2 rounded-md focus: outline-none"
onChange={handleSortChange}
>
<option value="">Default</option>
<option value="priceAsc">Price: Low to High</option>
<option value="priceDesc">Price: High to Low</option>
<option value="popularity">Popularity</option>
</select>
</div>
  )
}

export default SortOption