import React, { useState, useContext } from 'react';
import { createContext } from 'react';
import { toast } from 'react-toastify';

const BeansContext = createContext();

const BeansProvider = (props) => {
  const [beanList, innerSetBeanList] = useState({});

  const fetchBeanList = async (userid) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/user/${userid}/beans`,
        { method: "GET" }
      );
      const parseRes = await response.json();  
      setBeanList(parseRes);
    } catch (error) {}
    return beanList;
  };

  const setBeanList = (beans) => {
    const beansObj = {};
    beans.forEach(element => {
      beansObj[element['coffee_bean_id']] = element;
    });
    innerSetBeanList(beansObj);
  }

  const insertBean = async (userid, body) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/user/${userid}/bean`,
        {
          method: "POST",
          headers: {
            'Content-Type': "application/json"
          },
          body: JSON.stringify(body)
        }
      );
      const parseRes = await response.json();
      console.log('response: ', response)
      if (response.status !== 200) {
        toast.error(
          parseRes.error.message ? parseRes.error.message : response.statusText, {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
      else {
        fetchBeanList(userid);
        toast.success("New coffee bean is added successfully.", {
          position: toast.POSITION.BOTTOM_CENTER
        });
        return true
      }
    } catch (error) {
      toast.error(error.message, {
        position: toast.POSITION.BOTTOM_CENTER
      });
    }
    return false;
  }

  return (
    <BeansContext.Provider value={{beanList, fetchBeanList, setBeanList, insertBean}}>
    {props.children}
    </BeansContext.Provider>
  );
};

function useBeanList() {
  const context = useContext(BeansContext)
  if (!context) {
    throw new Error('useBeanList must be used within an BeansProvider')
  }
  return context.beanList
}

function useFetchBeanList() {
  const context = useContext(BeansContext)
  if (!context) {
    throw new Error('useFetchBeanList must be used within an BeansProvider')
  }
  return context.fetchBeanList
}

function useSetBeanList() {
  const context = useContext(BeansContext)
  if (!context) {
    throw new Error('useSetBeanList must be used within an BeansProvider')
  }
  return context.setBeanList
}

function useInsertBean() {
  const context = useContext(BeansContext)
  if (!context) {
    throw new Error('useInsertBean must be used within an BeansProvider')
  }
  return context.insertBean
}

export { BeansProvider, useBeanList, useFetchBeanList, useSetBeanList, useInsertBean }
