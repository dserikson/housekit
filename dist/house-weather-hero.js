/*
 * House Weather Hero
 * Version 0.1.0
 *
 * A mobile-first weather hero card for Home Assistant.
 */

const CARD_VERSION = "0.1.0";

class HouseWeatherHero extends HTMLElement {
  setConfig(config) {
    if (!config.weather_entity) {
      throw new Error("weather_entity is required");
    }

    this.config = {
      title: "Home",
      sun_entity: "sun.sun",
      ...config,
    };
  }

  set hass(hass) {
    this._hass = hass;

    if (!this.content) {
      this.innerHTML = `
        <ha-card>
          <div class="hero">
            <div class="location"></div>
            <div class="condition"></div>
            <div class="temperature"></div>
            <div class="sun-state"></div>
          </div>
        </ha-card>
      `;

      this.content = this.querySelector(".hero");

      const style = document.createElement("style");
      style.textContent = `
        ha-card {
          background: #151618;
          border: 0;
          border-radius: 20px;
          box-shadow: none;
          overflow: hidden;
        }

        .hero {
          min-height: 280px;
          box-sizing: border-box;
          padding: 30px 22px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #f2f2f3;
          font-family: var(
            --primary-font-family,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif
          );
        }

        .location {
          margin-bottom: 12px;
          color: #d0d0d2;
          font-size: 18px;
          font-weight: 500;
          letter-spacing: 0.01em;
        }

        .temperature {
          color: #f4f4f5;
          font-size: clamp(64px, 18vw, 92px);
          font-weight: 300;
          line-height: 0.95;
          letter-spacing: -0.055em;
        }

        .condition {
          order: 3;
          margin-top: 16px;
          color: #bebec2;
          font-size: 17px;
          font-weight: 400;
        }

        .sun-state {
          order: 4;
          margin-top: 24px;
          color: #b98962;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
      `;

      this.appendChild(style);
    }

    const weather = hass.states[this.config.weather_entity];
    const sun = hass.states[this.config.sun_entity];

    if (!weather) {
      this.querySelector(".location").textContent = this.config.title;
      this.querySelector(".temperature").textContent = "—";
      this.querySelector(".condition").textContent =
        `Entity not found: ${this.config.weather_entity}`;
      this.querySelector(".sun-state").textContent = "";
      return;
    }

    const temperature = weather.attributes.temperature;
    const unit =
      hass.config.unit_system?.temperature === "°F" ? "°F" : "°C";

    this.querySelector(".location").textContent = this.config.title;

    this.querySelector(".temperature").textContent =
      temperature === undefined || temperature === null
        ? "—"
        : `${Number(temperature).toFixed(1)}°`;

    this.querySelector(".condition").textContent =
      this.formatCondition(weather.state);

    this.querySelector(".sun-state").textContent = sun
      ? sun.state === "above_horizon"
        ? `Daylight · ${unit}`
        : `Night · ${unit}`
      : "";
  }

  formatCondition(value) {
    if (!value) return "Unknown";

    const labels = {
      "clear-night": "Clear Night",
      cloudy: "Cloudy",
      exceptional: "Exceptional",
      fog: "Fog",
      hail: "Hail",
      lightning: "Lightning",
      "lightning-rainy": "Thunderstorms",
      partlycloudy: "Partly Cloudy",
      pouring: "Heavy Rain",
      rainy: "Rain",
      snowy: "Snow",
      "snowy-rainy": "Sleet",
      sunny: "Sunny",
      windy: "Windy",
      "windy-variant": "Windy",
    };

    return (
      labels[value] ||
      value
        .replaceAll("_", " ")
        .replaceAll("-", " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    );
  }

  getCardSize() {
    return 4;
  }

  static getConfigElement() {
    return document.createElement("house-weather-hero-editor");
  }

  static getStubConfig() {
    return {
      weather_entity: "weather.forecast_home_2",
      sun_entity: "sun.sun",
      title: "Melbourne",
    };
  }
}

customElements.define("house-weather-hero", HouseWeatherHero);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "house-weather-hero",
  name: "House Weather Hero",
  description: "A dark, mobile-first weather and sun-path hero card.",
  preview: true,
});

console.info(
  `%c HOUSE-WEATHER-HERO %c v${CARD_VERSION} `,
  "background:#b98962;color:#111;padding:3px 6px;font-weight:700;",
  "background:#25272a;color:#ddd;padding:3px 6px;"
);
