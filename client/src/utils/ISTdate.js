function convertToISTDate(utcDateString) {
  const date = new Date(utcDateString);

  // Convert to IST using toLocaleString
  const options = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const istDateParts = date.toLocaleDateString("en-GB", options).split("/"); // ['28', '07', '2025']

  // Rearranging to 'YYYY-MM-DD'
  const formattedDate = `${istDateParts[2]}-${istDateParts[1]}-${istDateParts[0]}`;
  return formattedDate;
}

export default convertToISTDate;
