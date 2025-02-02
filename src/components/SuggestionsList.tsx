import "../style.css";
import { Spinner } from "datocms-react-ui";
import mapPinIcon from "../assets/svg/mapPinIcon.svg";

interface Suggestion {
  properties: {
    street?: string;
    housenumber?: string;
    city?: string;
    postcode?: string;
    country?: string;
    osm_id: string;
    type: string;
  };
  display_name: string;
  geometry: {
    coordinates: [number, number];
  };
}

interface SuggestionsListProps {
  suggestions: Suggestion[];
  onSelect: (suggestion: Suggestion) => void;
  loading: boolean;
}

export const SuggestionsList = ({
  suggestions,
  onSelect,
  loading,
}: SuggestionsListProps) => {
  return (
    <div style={{ position: "absolute", zIndex: 1, width: "100%" }}>
      <ul className="suggestions">
        {loading && (
          <li>
            <Spinner /> <p>fetching data</p>
          </li>
        )}
        {!loading &&
          suggestions.length > 0 &&
          suggestions.map((suggestion) => (
            <li
              className="suggestion"
              key={suggestion.properties.osm_id}
              onClick={() => onSelect(suggestion)}
            >
              <img src={mapPinIcon} alt="Map pin icon" />
              {suggestion.display_name}
            </li>
          ))}
      </ul>
    </div>
  );
};
