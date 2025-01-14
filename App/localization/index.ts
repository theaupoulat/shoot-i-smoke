// Sh**t! I Smoke
// Copyright (C) 2018-2019  Marcelo S. Coelho, Amaury Martiny

// Sh**t! I Smoke is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Sh**t! I Smoke is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Sh**t! I Smoke.  If not, see <http://www.gnu.org/licenses/>.

import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

// languages
const en = require('./languages/en');
const enUS = require('./languages/en-us');

i18n.fallbacks = true;
i18n.translations = {
  en,
  'en-US': enUS
};

// If the locale is en-US, then we use the `en-US` file. For any other locale,
// we use the `en` file
i18n.locale =
  Localization.locale && Localization.locale.toLowerCase() === 'en-us'
    ? 'en-US'
    : 'en';

export { i18n };
