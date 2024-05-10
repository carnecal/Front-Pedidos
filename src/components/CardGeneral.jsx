import React from 'react'
import { Link } from "react-router-dom";

export default function CardGeneral({img,data,page}) {
  return (
    

<div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <Link to={`/${page}`}>
        <img className="rounded-t" src={img} alt="" />
    
    <div class="p-5">
    
            <h5 className="mb-2 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{data}</h5>
        
        
    </div>
    </Link>
</div>

  )
}
