import { connect } from "datocms-plugin-sdk";
import "datocms-react-ui/styles.css";
import ConfigScreen from "./entrypoints/ConfigScreen";
import { render } from "./utils/render";
import { AddressInput } from "./entrypoints/AdressInput";

connect({
  renderConfigScreen(ctx) {
    return render(<ConfigScreen ctx={ctx} />);
  },

  manualFieldExtensions: () => [
    {
      id: "osm_address",
      name: "Osm Address",
      type: "editor",
      fieldTypes: "all",
      configurable: true,
    },
  ],

  renderFieldExtension: (fieldExtensionId, ctx) => {
    switch (fieldExtensionId) {
      case "osm_address":
        return render(<AddressInput ctx={ctx} />);
    }
  },
});
