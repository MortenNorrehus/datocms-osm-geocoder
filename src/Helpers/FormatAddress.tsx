export const FormatAddress = (address: any) => {
  console.log(address);
  return `${address.name || address.street} ${address.housenumber || ""}, ${
    address.postcode
  } ${address.town || address.city || address.village}, ${address.country}`;
};
