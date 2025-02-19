import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import "../style.css";
import get from "lodash/get";
import {
  Canvas,
  FieldGroup,
  FieldWrapper,
  TextField,
  TextInput,
} from "datocms-react-ui";
import { SuggestionsList } from "../components/SuggestionsList";
import { FormatAddress } from "../Helpers/FormatAddress";
import MapView from "../components/Map";

interface Suggestion {
  properties: {
    street?: string;
    housenumber?: string;
    city?: string;
    postcode?: string;
    country?: string;
    type: string;
  };
  display_name: string;
  geometry: {
    coordinates: [number, number];
  };
}

export const AddressInput = ({ ctx }: any) => {
  const currentValue = get(ctx.formValues, ctx.fieldPath);

  const initialMapboxValue = useMemo(
    () => JSON.parse(currentValue || "{}"),
    [ctx.formValues, ctx.fieldPath]
  );

  const [addressData, setAddressData] = useState(initialMapboxValue);

  console.log("ADDRESS", addressData);
  const [suggestions, setSuggestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState(
    addressData?.display_name || ""
  );
  const [loading, setLoading] = useState(false);

  const formattedAddress = (data: any) => {
    return {
      street: data?.properties?.street || "",
      housenumber: data?.properties?.housenumber || "",
      city: data?.properties?.city || "",
      postcode: data?.properties?.postcode || "",
      country: data?.properties?.country || "",
      display_name: data?.display_name || "",
      latitude: data?.geometry?.coordinates[1] || "",
      longitude: data?.geometry?.coordinates[0] || "",
    };
  };

  useEffect(() => {
    ctx.setFieldValue(ctx.fieldPath, JSON.stringify(addressData));
  }, [addressData]);

  const timeoutId = useRef<number | undefined>(undefined);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSearch = useCallback(
    async (query: string) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      try {
        const response = await fetch(
          `https://photon.komoot.io/api/?q=${query}&limit=6`,
          { signal }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();

        const places = result.features
          .filter((item: Suggestion) => item.properties.type !== "country")
          .map((item: any) => ({
            ...item,
            display_name: FormatAddress(item.properties),
          }));

        setSuggestions(places.length > 0 ? places : []);
        setLoading(false);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Fetch error: ", error);
        }
      }
    },
    [FormatAddress]
  );

  const handleChange = useCallback(
    (e: string) => {
      setSearchQuery(e);
      setLoading(true);
      clearTimeout(timeoutId.current);
      timeoutId.current = window.setTimeout(() => {
        handleSearch(e);
      }, 300);
    },
    [handleSearch]
  );

  const handleSelect = useCallback((suggestion: Suggestion) => {
    setAddressData(formattedAddress(suggestion));
    setSuggestions([]);
    setSearchQuery(suggestion.display_name);
  }, []);

  return (
    <Canvas ctx={ctx}>
      <FieldGroup className="fieldGroup">
        <FieldWrapper
          id="address-field"
          label="Address Lookup"
          hint="Start typing an address to search..."
        >
          <div style={{ position: "relative" }}>
            <TextInput
              id="adress-line"
              name="address-line"
              type="text"
              value={searchQuery || ""}
              onChange={(e) => handleChange(e)}
            />
            <SuggestionsList
              suggestions={suggestions}
              loading={loading}
              onSelect={handleSelect}
            />
          </div>
        </FieldWrapper>
      </FieldGroup>

      <FieldGroup className="address-data">
        <TextField
          id="street-input"
          name="street"
          value={addressData?.street || ""}
          onChange={(e) => setAddressData({ ...addressData, street: e })}
          label="Street"
        />
        <TextField
          id="house-number-input"
          name="house-number"
          value={addressData?.housenumber || ""}
          onChange={(e) => setAddressData({ ...addressData, housenumber: e })}
          label="House number"
        />

        <TextField
          id="postcode-input"
          name="postcode"
          value={addressData?.postcode || ""}
          onChange={(e) => setAddressData({ ...addressData, postcode: e })}
          label="Postal Code"
        />

        <TextField
          id="city-input"
          name="city"
          value={addressData?.city || ""}
          onChange={(e) => setAddressData({ ...addressData, city: e })}
          label="City"
        />

        <TextField
          id="country-input"
          name="country"
          value={addressData?.country || ""}
          onChange={(e) => setAddressData({ ...addressData, country: e })}
          label="Country"
        />
      </FieldGroup>

      <FieldGroup className="fieldGroupRow">
        <FieldWrapper id="latitude" label="Latitude">
          <TextInput
            id="latitude-input"
            name="latitude"
            type="text"
            value={addressData?.latitude || ""}
            disabled
          />
        </FieldWrapper>
        <FieldWrapper id="longitude" label="Longitude">
          <TextInput
            id="longitude-input"
            name="longitude"
            type="text"
            value={addressData?.longitude || ""}
            disabled
          />
        </FieldWrapper>
      </FieldGroup>

      <MapView
        latitude={addressData?.latitude || 0}
        longitude={addressData?.longitude || 0}
      />
    </Canvas>
  );
};
