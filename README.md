# Housekit

A dark, mobile-first weather and sun-path card for Home Assistant.

## Current features

- Current outdoor temperature
- Current weather condition
- Day/night state
- Near-black, restrained visual design
- Mobile-first typography

## Installation through HACS

1. Open HACS in Home Assistant.
2. Open the three-dot menu.
3. Select **Custom repositories**.
4. Add this repository's GitHub URL.
5. Select **Dashboard** as the type.
6. Install **House Weather Hero**.
7. Reload Home Assistant.

## Card configuration

```yaml
type: custom:house-weather-hero
weather_entity: weather.forecast_home_2
sun_entity: sun.sun
title: Melbourne
