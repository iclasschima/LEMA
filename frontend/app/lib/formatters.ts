import { User } from "../types";

export const formatAddress = (address: User["address"]): string => {
  if (!address) return "N/A";

  const { street, state, city, zipcode } = address;
  return `${street}, ${state}, ${city}, ${zipcode}`;
};
