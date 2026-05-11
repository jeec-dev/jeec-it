#!/usr/bin/env bash

set -euo pipefail

BADGE_DIR="public/icons/badges"

mkdir -p "$BADGE_DIR"

create_badge() {
  local file_name="$1"
  local path_markup="$2"

  cat > "$BADGE_DIR/$file_name.svg" <<EOF
<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <g fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    $path_markup
  </g>
</svg>
EOF
}

create_badge "chessboard" '
  <path d="M18 20H46V48H18Z"/>
  <path d="M18 27H46M18 34H46M18 41H46"/>
  <path d="M25 20V48M32 20V48M39 20V48"/>
'

create_badge "grinder-kit" '
  <circle cx="26" cy="32" r="8"/>
  <circle cx="39" cy="31" r="6"/>
  <path d="M18 45H46"/>
  <path d="M20 22H42"/>
  <path d="M23 24L18 17M34 24L37 17"/>
'

create_badge "jack-daniels" '
  <path d="M27 16H37"/>
  <path d="M29 16V24L24 29V48H40V29L35 24V16"/>
  <path d="M27 34H37M27 40H37"/>
'

create_badge "signed-contract" '
  <path d="M21 15H41L47 21V49H21Z"/>
  <path d="M41 15V22H47"/>
  <path d="M27 29H39M27 35H39"/>
  <path d="M26 43C31 38 35 49 42 42"/>
'

create_badge "disco-ball" '
  <path d="M32 13V20"/>
  <circle cx="32" cy="35" r="15"/>
  <path d="M20 30H44M19 38H45"/>
  <path d="M27 21C23 29 23 40 27 49"/>
  <path d="M37 21C41 29 41 40 37 49"/>
'

create_badge "marijuana-leaf" '
  <path d="M32 49V33"/>
  <path d="M32 33C26 25 26 18 32 12C38 18 38 25 32 33Z"/>
  <path d="M30 36C22 30 18 25 18 18C25 20 29 27 30 36Z"/>
  <path d="M34 36C42 30 46 25 46 18C39 20 35 27 34 36Z"/>
  <path d="M29 39C22 39 17 36 14 30C21 29 27 33 29 39Z"/>
  <path d="M35 39C42 39 47 36 50 30C43 29 37 33 35 39Z"/>
'

create_badge "rick-gun-morty-shirt" '
  <path d="M17 33H38"/>
  <path d="M38 28H48V38H38Z"/>
  <path d="M22 33V42"/>
  <path d="M27 42H37"/>
  <path d="M20 20L28 15L36 20L41 17L47 25L42 29L38 24V49H18V24L14 29L9 25L15 17Z"/>
'

create_badge "acoustic-guitar" '
  <path d="M39 15L47 23"/>
  <path d="M36 18L44 26"/>
  <path d="M18 42C13 37 16 27 24 28C25 19 36 17 40 25C46 26 48 36 43 41C37 48 25 49 18 42Z"/>
  <circle cx="31" cy="35" r="4"/>
  <path d="M35 31L44 22"/>
'

create_badge "notebook" '
  <path d="M20 15H45V49H20Z"/>
  <path d="M25 15V49"/>
  <path d="M29 25H40M29 32H40M29 39H36"/>
  <path d="M18 21H22M18 29H22M18 37H22M18 45H22"/>
'

create_badge "toy-train" '
  <path d="M15 35H48V45H15Z"/>
  <path d="M22 25H36V35H22Z"/>
  <path d="M38 29H45V35H38Z"/>
  <circle cx="23" cy="48" r="4"/>
  <circle cx="41" cy="48" r="4"/>
  <path d="M16 25H21"/>
'

create_badge "astronaut" '
  <circle cx="32" cy="22" r="8"/>
  <path d="M24 32H40V48H24Z"/>
  <path d="M18 35L24 39"/>
  <path d="M46 35L40 39"/>
  <path d="M28 48L25 54"/>
  <path d="M36 48L39 54"/>
  <path d="M28 22H36"/>
'

create_badge "planet" '
  <circle cx="32" cy="32" r="17"/>
  <path d="M12 37C23 29 40 24 52 27"/>
  <path d="M15 41C28 33 42 29 51 31"/>
  <circle cx="27" cy="26" r="2"/>
  <circle cx="38" cy="37" r="3"/>
'

create_badge "pill-bottle" '
  <path d="M25 16H39"/>
  <path d="M27 20H37"/>
  <path d="M24 24H40V50H24Z"/>
  <path d="M27 32H37"/>
  <path d="M29 41H35"/>
  <circle cx="32" cy="41" r="5"/>
'

echo "Generated simplified badge SVGs in $BADGE_DIR"