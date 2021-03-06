import React, { useState } from 'react'
import { GiCoffeeBeans } from 'react-icons/gi'
import { MdWaterDrop } from 'react-icons/md'
import { FaCoffee } from 'react-icons/fa'
import { HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi'
import ChartRadarTaste from './ChartRadarTaste'
import { generateStarIconList } from '../../../helpers/GenerateIconList'
import Dropdown from '../../../elements/Dropdown'


const Row = ({recipe, onEditClick, onDeleteClick}) => {
  const [openDetails, setOpenDetails] = useState(false)

  const parseExtractionTime = () => {
    const extractionTime = Object.keys(recipe.extraction_time).map((timeUnit) => {
      const unit =
        timeUnit === "hours" ? "hr" : timeUnit === "minutes" ? "min" : "sec";
      return `${recipe.extraction_time[timeUnit]} ${unit} `;
    });
    return extractionTime;
  };

  return (
    <>
      <div className="relative px-4 pt-8 pb-4 mb-4 bg-white shadow-sm rounded-md w-full transition-all">
        <div className="absolute top-2 right-2">
          <Dropdown dropdownText="" type="dot">
            <div className="dropdown-content">
              <button
                type="button"
                className="dropdown-item"
                onClick={onEditClick}
              >
                Edit
              </button>
              <button
                type="button"
                className="dropdown-item"
                onClick={onDeleteClick}
              >
                Delete
              </button>
            </div>
          </Dropdown>
        </div>

        <div className="flex">
          <div className="flex flex-col justify-between w-1/4 h-auto px-4 border-r">
            <p>{recipe.brew_date ? recipe.brew_date.split("T")[0] : "No date"}</p>
            <h3 className="text-xl my-2">
              {recipe.method[0]?.label ?? "-"}
            </h3>
            <div className="flex justify-end">
              {recipe.total_rate ? generateStarIconList(recipe.total_rate) : null}
            </div>
          </div>
          <div className="flex flex-col justify-between relative w-1/4 h-auto px-4 border-r">
            <div className="flex justify-between">
              <GiCoffeeBeans className="w-5 h-5 opacity-40" />
              <p className="text-right mb-4">
                <span className="text-2xl">
                  {recipe.grounds_weight ?? "-"}
                </span>{" "}
                g
              </p>
            </div>
            <div className="flex justify-end flex-wrap">
              {recipe.grind_size ? (
                <span className="basic-chip">{recipe.grind_size}</span>
              ) : null}
              {recipe.grinder[0] ? (
                <span className="basic-chip">
                  {recipe.grinder[0].label}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col justify-between relative w-1/4 h-auto px-4 border-r">
            <div className="flex justify-between">
              <MdWaterDrop className="w-5 h-5 opacity-40" />
              <p className="text-right mb-4">
                <span className="text-2xl">
                  {recipe.water_weight ?? "-"}
                </span>{" "}
                ml
              </p>
            </div>
            <div className="flex justify-end flex-wrap">
              {recipe.water_temp ? (
                <span className="basic-chip">{recipe.water_temp}</span>
              ) : null}
              {recipe.water[0] ? (
                <span className="basic-chip">
                  {recipe.water[0].label}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col justify-between relative w-1/4 h-auto px-4">
            <div className="flex justify-between">
              <FaCoffee className="w-5 h-5 opacity-40" />
              <p className="text-right mb-4">
                <span className="text-2xl">
                  {recipe.yield_weight ?? "-"}
                </span>{" "}
                ml
              </p>
            </div>
            <div className="flex justify-end flex-wrap">
              {recipe.extraction_time ? (
                <span className="basic-chip">{parseExtractionTime()}</span>
              ) : null}
              {recipe.tds ? <span className="basic-chip">{recipe.tds}</span> : null}
            </div>
          </div>
        </div>
        <div className="overflow-hidden">
          <div
            className="ease-in-out transition-all duration-500"
            style={openDetails ? {} : { marginTop: "-100%" }}
          >
            <div className="flex my-12">
              <div className="w-1/2 px-6 mt-auto mb-0">
                <div className="coffee-detail-section">
                  <label>Total Rate: </label>
                  <p>{recipe.total_rate ?? "-"}/100</p>
                </div>
                <div className="coffee-detail-section">
                  <label>Grinder: </label>
                  <p>
                    {recipe.grinder[0]?.label ?? "-"}
                  </p>
                </div>
                <div className="coffee-detail-section">
                  <label>Grind Size: </label>
                  <p>{recipe.grind_size ?? "-"}</p>
                </div>
                <div className="coffee-detail-section">
                  <label>Grounds Weight: </label>
                  <p>{recipe.grounds_weight ?? "-"}</p>
                </div>
                <div className="coffee-detail-section">
                  <label>Water: </label>
                  <p>
                    {recipe.water[0]?.label ?? "-"}
                  </p>
                </div>
                <div className="coffee-detail-section">
                  <label>Water Weight: </label>
                  <p>{recipe.water_weight ?? "-"}</p>
                </div>
                <div className="coffee-detail-section">
                  <label>Water Temperature: </label>
                  <p>{recipe.water_temp ?? "-"}</p>
                </div>
                <div className="coffee-detail-section">
                  <label>Extraction Time: </label>
                  <p>{recipe.extraction_time ? parseExtractionTime() : "-"}</p>
                </div>
                <div className="coffee-detail-section">
                  <label>Yield Weight: </label>
                  <p>{recipe.yield_weight ?? "-"}</p>
                </div>
                <div className="coffee-detail-section">
                  <label>TDS: </label>
                  <p>{recipe.tds ?? "-"}</p>
                </div>
              </div>
              {Object.keys(recipe.palate_rates).length > 0 ? (
                <ChartRadarTaste
                  className="w-1/2 px-6 mx-auto"
                  labels={Object.values(recipe.palate_rates).map(palates => palates.label)}
                  rates={Object.values(recipe.palate_rates).map(palates => palates.rate)}
                />
              ) : null}
            </div>
            <div className="px-8 mb-8">
              <label className="font-medium mr-3">Memo: </label>
              <p className="inline">{recipe.memo ?? "-"}</p>
            </div>
          </div>
        </div>
        <div
          className="cursor-pointer"
          onClick={(e) => setOpenDetails(!openDetails)}
        >
          {openDetails ? (
            <HiOutlineChevronUp className="w-6 h-6 mt-2 mx-auto" />
          ) : (
            <HiOutlineChevronDown className="w-6 h-6 mt-2 mx-auto" />
          )}
        </div>
      </div>
    </>
  );
}

export default Row
