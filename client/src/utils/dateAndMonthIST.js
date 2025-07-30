function getDateAndMonthIST(utcDateString) {
  const date = new Date(utcDateString);

  const options = {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'long'
  };

  return date.toLocaleDateString('en-GB', options); // "27 July"
}

export default getDateAndMonthIST;