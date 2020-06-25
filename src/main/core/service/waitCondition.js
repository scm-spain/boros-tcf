export const waitCondition = ({
  condition,
  timeout = 50,
  interval = 5,
  timeoutMessage = 'Time out reached'
}) =>
  new Promise((resolve, reject) => {
    const iid = setInterval(() => {
      if (condition()) {
        clearTimeout(tid)
        clearInterval(iid)
        resolve()
      }
    }, interval)
    const tid = setTimeout(() => {
      clearTimeout(tid)
      clearInterval(iid)
      reject(new Error(timeoutMessage))
    }, timeout)
  })
