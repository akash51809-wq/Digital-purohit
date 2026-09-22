export function formatFirebaseDate(date: any): string {
  if (!date) return 'No date'
  
  try {
    let jsDate: Date
    
    if (date.seconds) {
      // Firebase Timestamp
      jsDate = new Date(date.seconds * 1000)
    } else if (typeof date === 'string') {
      // ISO string
      jsDate = new Date(date)
    } else if (date instanceof Date) {
      // Already a Date object
      jsDate = date
    } else {
      return 'Invalid date'
    }
    
    return jsDate.toLocaleDateString()
  } catch (error) {
    console.error('Date formatting error:', error)
    return 'Invalid date'
  }
}

export function formatFirebaseDateTime(date: any): string {
  if (!date) return 'No date'
  
  try {
    let jsDate: Date
    
    if (date.seconds) {
      // Firebase Timestamp
      jsDate = new Date(date.seconds * 1000)
    } else if (typeof date === 'string') {
      // ISO string
      jsDate = new Date(date)
    } else if (date instanceof Date) {
      // Already a Date object
      jsDate = date
    } else {
      return 'Invalid date'
    }
    
    return jsDate.toLocaleString()
  } catch (error) {
    console.error('DateTime formatting error:', error)
    return 'Invalid date'
  }
}