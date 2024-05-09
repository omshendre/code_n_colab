import React, { useState } from 'react';

function Stats({ setInput }) {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
    setInput(value); // Update the input using the provided setInput function
  };

  return (
    <div className='flex flex-col justify-center items-center pt-[20px] gap-2'>
      <div className='p-3 pt-5 text-lg text-white font-bold'>INPUT</div>
      <textarea
        className='h-[20vh] w-[80%] p-3 pl-4 rounded-lg border font-sans text-blue-300'
        value={inputValue} // Set the value of the textarea to inputValue
        onChange={handleChange} // Call handleChange when the textarea value changes
        style={{ backgroundColor: '#1C1E29' }} // Apply background color style
      />
    </div>
  );
}

export default Stats;
