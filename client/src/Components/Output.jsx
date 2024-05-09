import React from 'react'

function Output({output}) {
  console.log(output);
  return (
    <div className='flex flex-col  justify-center items-center pt-[20px]  gap-2'  >
        <div className=' p-3  pt-5 text-lg  text-white font-bold   ' >
        OUTPUT
        </div>
        <div  className=' h-[50vh]  w-[80%] p-2  rounded-lg border  font-sans  text-orange-400 ' disabled={true}  >{output} </div>
    </div>
  )
}

export default Output