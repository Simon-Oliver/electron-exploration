import React, {useState} from "react"

export const ErrorContext = React.createContext()

export const ErrorContextProvider = (props) => {
  const [errorState, setErrorState] = useState({
    isError: false,
    error: '',
    color: '',
    toggleError: (newState) => {
      setErrorState({
        ...errorState,
        ...newState,
      });
    },
  });

  return(
    <ErrorContext.Provider value={errorState}>
      {props.children}
    </ErrorContext.Provider>
  )

}





