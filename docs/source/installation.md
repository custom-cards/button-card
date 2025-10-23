## HACS

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=custom-cards&repository=button-card&category=lovelace)

1. Make sure the [HACS](https://github.com/custom-components/hacs) component is installed and working.
2. Search for `button-card` and add it through HACS
3. Refresh home-assistant.

> Note: If you are using YAML mode for your lovelace configuration, review [these instructions](https://www.home-assistant.io/dashboards/dashboards/#using-yaml-for-the-overview-dashboard) to include external resources.

## Manual

1. Download [button-card.js](http://www.github.com/custom-cards/button-card/releases/latest/download/button-card.js)
2. Place the file in your `config/www` folder
3. Add `/local/button_card.js` as a [dashboard JavaScript module resource](https://developers.home-assistant.io/docs/frontend/custom-ui/registering-resources/).

> Note: Your browser may block the download link as the file is a javascript file. If the link seems to do nothing, copy the link address and use directly in your browser's address bar where you will most likely get prompt on whether to allow the download or not.

> Note: If you are using YAML mode for your lovelace configuration, review [these instructions](https://www.home-assistant.io/dashboards/dashboards/#using-yaml-for-the-overview-dashboard) to include external resources.
