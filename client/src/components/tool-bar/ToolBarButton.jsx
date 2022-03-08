import { PlusIcon } from '@heroicons/react/outline'
import React from 'react'
import { capitalize } from '../../utils/HtmlConverter'

const ToolBarButton = ({title, onClick}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="flex items-center text-burnt-sienna text-sm 
      px-3 ml-4 mr-0 opacity-80 
      hover:opacity-100 ease-linear transition-all duration-150">
      <PlusIcon className="w-4 h-4 mr-1 inline" />
      {capitalize(title)}
    </button>
  )
}

export default ToolBarButton