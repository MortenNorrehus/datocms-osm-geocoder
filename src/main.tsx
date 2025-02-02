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
      id: "better_geolocation",
      name: "Better Geolocation",
      type: "editor",
      fieldTypes: "all",
      configurable: true,
    },
  ],

  renderFieldExtension: (fieldExtensionId, ctx) => {
    switch (fieldExtensionId) {
      case "better_geolocation":
        return render(<AddressInput ctx={ctx} />);
    }
  },
});
