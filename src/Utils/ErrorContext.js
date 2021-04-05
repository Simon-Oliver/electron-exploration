import React, {useState, useEffect} from "react"

export const ErrorContext = React.createContext()

export const ErrorContextProvider = (props) => {
  const [errorData, setErrorData] = useState({color:"",message:""})
  // const [errorMessage, setErrorMessage] = useState()
  // const [errorColor, setErrorColor] = useState()
  const [isError, setIsError] = useState()


  const toggleError = ()=>{
    setIsError(!isError)
  }

  const setError = (error) =>{
    setErrorData(error)
  }

  // const setError = (message) => {
  //   setErrorMessage(message)
  // }

  // const setErrColor = (errColor) => {
  //   setErrorColor(errColor)
  // }

  const value = {
    isError,
    color: errorData.color,
    error: errorData.message,
    toggleError,
    setError
    // setError,
    // setErrColor
  }

  return(
    <ErrorContext.Provider value={{...value}}>
      {props.children}
    </ErrorContext.Provider>
  )

}





