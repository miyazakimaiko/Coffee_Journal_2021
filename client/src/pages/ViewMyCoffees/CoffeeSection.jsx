import React from 'react'
import CoffeeBag from '../../svgs/CoffeeBag'
import { StarIcon } from '@heroicons/react/outline'
import { Link } from 'react-router-dom'

const CoffeeSection = ({name}) => {
  return (
    <div className="relative p-3 w-1/3 max-w-350px min-w-250px">
      <Link to="/recipes/1/1">
        <div 
          className="
            absolute left-4 right-4 top-4 bottom-4 
            bg-burnt-sienna rounded-md z-10 
            transition-opacity duration-300 ease-out opacity-0 hover:opacity-80
        ">
          <span  className=" h-full w-full flex justify-center items-center text-white font-bold text-2xl">
            View Recipes
          </span>
        </div>
        <div className="p-4 bg-white shadow-sm rounded-md">
          <div className="m-auto w-full max-w-10">
            <CoffeeBag name={name} />
          </div>
          <div className="text-center">
            <h4 className="text-lg pt-2">Kenya</h4>
            <span className="flex justify-center pt-2 text-yellow">
              <StarIcon className="h-5 w-5" />
              <StarIcon className="h-5 w-5" />
              <StarIcon className="h-5 w-5" />
              <StarIcon className="h-5 w-5" />
              <StarIcon className="h-5 w-5" />
            </span>
            <div className="pt-2">
              <span>Roasted at </span>
              <span>2021-12-21</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default CoffeeSection
