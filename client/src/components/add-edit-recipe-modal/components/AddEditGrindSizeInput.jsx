import React, { useState } from 'react'
import FormInput from '../../elements/FormInput';

const AddEditGrindSizeInput = ({recipe, setRecipe}) => {

  const [sizeWarningText, setSizeWarningText] = useState("");

  const setGrindSize = (grade) => {
    setRecipe({...recipe, grade});
    if (grade < 0.0) {
      setSizeWarningText(<span className="text-red">Please enter a positive number</span>)
    } else {
      setSizeWarningText("")
    }
  }

  return (
    <FormInput
      title="Grind Size"
      type="number"
      step="0.1"
      name="grindsize"
      placeholder="e.g. 11.5"
      value={recipe.grind_size}
      onChange={e => setGrindSize(e.target.value)}
      warningText={sizeWarningText}
    />
  )
}

export default AddEditGrindSizeInput