import { DependencyList, EffectCallback, useEffect, useRef } from "react"

export const useDidUpdate = (fn: EffectCallback, deps: DependencyList) => {

  const hasMounted = useRef(false);

  useEffect(() => {
    if(hasMounted.current){
      return fn();
    }else {
      hasMounted.current = true;
    }
  }, deps)
  
}