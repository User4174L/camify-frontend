# Checkout validatie — advies

Doel: client-side feedback per veld, Sendcloud als final guard.

## Aanpak

1. **Country dropdown drijft alles aan** — bij wijzigen reset postcode-regex, state/province veld en libphonenumber default.
2. **Valideer on blur, niet on keystroke** — flash-rode-velden tijdens typen frustreren.
3. **Strip whitespace en uppercase** vóór het toepassen van de regex.
4. **Sendcloud `/api/v3/addresses/validate`** als pre-submit check op de server (vangt niet-bestaande adressen).

## Extra adresvelden per land

Gemeten via Sendcloud validate-sweep over alle 249 ISO-landen (2026-05-11):

| Veld | Tonen bij |
|---|---|
| `state` (ISO 3166-2 dropdown) | US, CA, AU |
| `province` (ISO 3166-2 dropdown) | IT |
| `address_line_2` | Iedereen, collapsed achter "+ Apartment, suite, etc." |

Sendcloud beschouwt `address_line_2` nooit als verplicht.

## Postcode regex per land

Case-insensitive, whitespace getolereerd.

| Land | Regex |
|---|---|
| NL | `^[1-9][0-9]{3}\s?[A-Z]{2}$` |
| BE | `^[1-9][0-9]{3}$` |
| DE | `^[0-9]{5}$` |
| FR | `^[0-9]{5}$` |
| ES | `^[0-9]{5}$` |
| IT | `^[0-9]{5}$` |
| AT | `^[1-9][0-9]{3}$` |
| CH | `^[0-9]{4}$` |
| LU | `^[0-9]{4}$` |
| DK | `^[0-9]{4}$` |
| SE | `^[0-9]{3}\s?[0-9]{2}$` |
| NO | `^[0-9]{4}$` |
| FI | `^[0-9]{5}$` |
| PL | `^[0-9]{2}-?[0-9]{3}$` |
| CZ | `^[0-9]{3}\s?[0-9]{2}$` |
| SK | `^[0-9]{3}\s?[0-9]{2}$` |
| HU | `^[0-9]{4}$` |
| PT | `^[0-9]{4}-[0-9]{3}$` |
| IE | `^[AC-FHKNPRTV-Y][0-9]{2}\s?[AC-FHKNPRTV-Y0-9]{4}$` |
| GB | `^([Gg][Ii][Rr] ?0[Aa]{2})\|([A-PR-UWYZ]([0-9]{1,2}\|([A-HK-Y][0-9]([0-9]\|[ABEHMNPRV-Y]))\|[0-9][A-HJKPS-UW]) ?[0-9][ABD-HJLNP-UW-Z]{2})$` |
| US | `^[0-9]{5}(-[0-9]{4})?$` |
| CA | `^[ABCEGHJ-NPRSTVXY][0-9][ABCEGHJ-NPRSTV-Z]\s?[0-9][ABCEGHJ-NPRSTV-Z][0-9]$` |
| AU | `^[0-9]{4}$` |
| JP | `^[0-9]{3}-?[0-9]{4}$` |
| NZ | `^[0-9]{4}$` |

**Onbekend land:** fallback `^.{2,12}$` + server-side Sendcloud validate.

## Telefoonnummer — niet zelf regex

Gebruik `libphonenumber-js` (78kB, Google's regels, ~250 landen):

```ts
import { isValidPhoneNumber, parsePhoneNumber, AsYouType } from "libphonenumber-js"

// Validatie (countryCode = ISO2 uit dropdown)
isValidPhoneNumber(input, "NL")

// Opslag in E.164 voor Sendcloud + Notive
parsePhoneNumber(input, "NL")?.format("E.164")  // "+31612345678"

// Live formatteren tijdens typen
new AsYouType("NL").input("0612345678")  // "06 12345678"
```

## Lengte-limieten (Sendcloud minimum, alle carriers)

| Veld | Max |
|---|---|
| `first_name + last_name` | 30 |
| `address_line_1` (street) | 35 |
| `address_line_2` | 32 |
| `house_number` | 8 |
| `city` | 25 |
| `postal_code` | 12 |
| `company_name` | 35 |
| `email` | 254 (RFC) |

## Implementatie

Centraliseer alles in `data/validation.ts`:

```ts
export const POSTCODE_REGEX: Record<string, RegExp> = { ... }
export const STATE_REQUIRED = new Set(["US", "CA", "AU"])
export const PROVINCE_REQUIRED = new Set(["IT"])
export const MAX_LENGTHS = { firstName: 30, street: 35, ... }
```

State/province lijsten als ISO 3166-2 datasets (US-CA, CA-ON, AU-NSW, IT-RM) — bv. via `iso-3166-2` npm package.
