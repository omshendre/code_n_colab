import React from 'react'

function Output({output,error}) {
  return (
    <div className='flex flex-col  justify-center items-center pt-[20px]  gap-2'  >
        <div className=' p-3  pt-5 text-lg  text-white font-bold   ' >
        OUTPUT
        </div>
        <div
        className={`h-[50vh] w-[80%] p-2 rounded-lg border font-sans overflow-auto ${error ? 'border-red-500 text-red-500' : 'text-orange-400'}`}
        disabled={true}
        >
  {output.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br/>
    </React.Fragment>
  ))}
</div>
    </div>
  )
}

export default Output