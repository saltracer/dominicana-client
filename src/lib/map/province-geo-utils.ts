export const getProvinceColor = (provinceName: string): string => {
  switch (provinceName) {
    case "Province of St. Joseph":
      return "#228B22"; // Forest Green
    case "Province of St. Albert the Great":
      return "#8B4513"; // Saddle Brown
    case "Province of St. Dominic":
      return "#4682B4"; // Steel Blue
    case "Province of the Most Holy Name of Jesus":
      return "#D2691E"; // Chocolate
    case "Province of Our Lady of the Rosary":
      return "#800080"; // Purple
    case "Province of the Philippines":
      return "#FF8C00"; // Dark Orange
    case "Province of Vietnam":
      return "#C71585"; // Medium Violet Red
    case "Province of Nigeria and Ghana":
      return "#2F4F4F"; // Dark Slate Gray
    case "Province of Teutonia":
      return "#BDB76B"; // Dark Khaki
    case "Province of Bética":
      return "#CD5C5C"; // Indian Red
    case "Province of Ireland":
      return "#008000"; // Green
    case "Province of Toulouse":
      return "#A0522D"; // Sienna
    case "Province of Canada":
      return "#DC143C"; // Crimson
    case "Province of France":
      return "#6A5ACD"; // Slate Blue
    case "Province of Poland":
      return "#20B2AA"; // Light Sea Green
    case "Province of Portugal":
      return "#DA70D6"; // Orchid
    case "Province of Spain":
      return "#FF4500"; // Orange Red
    case "Province of England":
      return "#708090"; // Slate Gray
    case "Province of Austria":
      return "#BC8F8F"; // Rosy Brown
    case "Province of Croatia":
      return "#F08080"; // Light Coral
    case "Province of Hungary":
      return "#98FB98"; // Pale Green
    case "Province of Bohemia":
      return "#F4A460"; // Sandy Brown
    case "Province of Switzerland":
      return "#D87093"; // Pale Violet Red
    case "Vicariate of Southern Africa":
      return "#A9A9A9"; // Dark Gray
    default:
      return "#808080"; // Gray
  }
};
