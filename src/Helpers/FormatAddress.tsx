export const FormatAddress = (address: any) => {
  const { name, street, housenumber, postcode, town, city, village, country } =
    address;

  const addressName = name || street || "";
  const addressHouseNumber = housenumber || "";
  const addressPostcode = postcode || "";
  const addressTown = town || city || village || "";
  const addressCountry = country || "";

  return `${addressName} ${
    addressHouseNumber ? addressHouseNumber + "," : ""
  } ${addressPostcode} ${addressTown}, ${addressCountry}`;
};
