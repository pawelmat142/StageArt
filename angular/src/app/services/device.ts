const isMobile = () => {
  const navigatorUserAgent = navigator.userAgent || navigator.vendor;
  const windowOpera = (window as any).opera;
  const userAgent = navigatorUserAgent || (typeof windowOpera === 'string' ? windowOpera : '')
  const result = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
  console.log('ismobile = ' + result)
  return result
}

export const MOBILE = isMobile()

export const DESKTOP = !MOBILE