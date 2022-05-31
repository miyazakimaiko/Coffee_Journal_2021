import React, { useState } from 'react'
import FormInput from '../../../elements/FormInput'

const WaterWeightInput = ({recipe, setRecipe}) => {
  const [warning, setWarning] = useState({
    invalid: false,
    message: "",
  });

  const setWeight = (weight) => {
    if (weight.length === 0) {
      setRecipe({...recipe, water_weight: null});
      resetWarning();
    }
    else {
      setRecipe({...recipe, water_weight: weight});

      const valueIsNumber = checkValueIsNumber(weight);
  
      if (!valueIsNumber) {
        
        setWarning({
          ...warning,
          invalid: true,
          message: <span className="text-red">
            Value must be a number.
          </span>
        });
      }
      else {
        const weightIsInRange = checkNumberIsInRange(weight);
  
        if (!weightIsInRange) {

          setWarning({
            ...warning,
            invalid: true,
            message: <span className="text-red">
              Please enter a number between 0.0 and 10000.0.
            </span> 
          });
        }
        else {
          resetWarning();
        }
      }
    }
  }

  const checkValueIsNumber = (value) => {
    const includesForbiddenChar = ["e", "E", "+", "-"].includes(value);
    return !isNaN(value) && !includesForbiddenChar;
  }

  const checkNumberIsInRange = (number) => {
    return number >= 0.0 && number <= 10000.0;
  }

  const resetWarning = () => {
    setWarning({
      ...warning,
      invalid: false,
      message: "",
    });
  }

  return (
    <FormInput
      title="Water Weight (ml)"
      type="text" 
      name="waterweight"
      autoComplete="off"
      placeholder="e.g. 200.5"
      value={recipe.water_weight}
      invalid={warning.invalid}
      onChange={e => setWeight(e.target.value)}
      warningText={warning.message}
    />
  )
}

export default WaterWeightInput