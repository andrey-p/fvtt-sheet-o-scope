type LibWrapper = {
  register: (
    moduleName: string,
    overrideScope: string,
    wrapperFn: (fn:Function, ...args:any[]) => any,
    wrapperType?: 'WRAPPER' | 'MIXED' | 'OVERRIDE' | null
  ) => void
}

declare global {
  var libWrapper: LibWrapper;
}

export default global;
