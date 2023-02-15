import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file


import { DateRangePicker } from 'react-date-range';
import React, { useEffect } from 'react';
import { useState } from 'react';
const MyComponent = ({data, blocked}) => {
  const [disabledDates, setDisabledDate] = useState([null])
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const [selectionRange, setSelectionDate] = useState({
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
  }) 

  useEffect(()=> {
    setDisabledDate(blocked)
})
  const handleSelect = (ranges)=>{
    setSelectionDate(ranges.selection)
    data(ranges.selection.startDate, ranges.selection.endDate)
  }

  

    return (
      <div>
        <p>Selectionnez les dates</p>
        <DateRangePicker
          ranges={[selectionRange]}
          onChange={handleSelect}
          disabledDates={disabledDates}
        />
      </div>

    )
}

export default MyComponent;