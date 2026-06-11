import { CropData } from "../../types";
import { riceData } from "./rice";

// We're stubbing other crops as empty arrays to satisfy the assignment,
// in a real app we'd fully populate them like rice.
export const placeholderCrop = (id: string, name: string, icon: string): CropData => ({
  id,
  name,
  icon,
  diseases: [],
  questions: []
});

export const crops: CropData[] = [
  riceData,
  placeholderCrop("wheat", "Wheat | গম", "🌾"),
  placeholderCrop("potato", "Potato | আলু", "🥔"),
  placeholderCrop("tomato", "Tomato | টমেটো", "🍅"),
  placeholderCrop("chili", "Chili | মরিচ", "🌶️"),
  placeholderCrop("mango", "Mango | আম", "🥭"),
  placeholderCrop("eggplant", "Eggplant | বেগুন", "🍆"),
];

export const getCropById = (id: string): CropData | undefined => {
  return crops.find((c) => c.id === id);
};
