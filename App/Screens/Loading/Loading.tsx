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

import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Background } from './Background';

import { i18n } from '../../localization';
import { ApiContext, GpsLocationContext } from '../../stores';
import { Api } from '../../stores/fetchApi';
import { Location } from '../../stores/fetchGpsPosition';
import * as theme from '../../util/theme';

// The variable returned by setTimeout for longWaiting
let longWaitingTimeout: NodeJS.Timeout | null = null;

function clearLongWaiting () {
  if (longWaitingTimeout) {
    clearTimeout(longWaitingTimeout);
    longWaitingTimeout = null;
  }
}

export function Loading () {
  const { api } = useContext(ApiContext);
  const gps = useContext(GpsLocationContext);

  const [longWaiting, setLongWaiting] = useState(false); // If api is taking a long time

  useEffect(() => {
    // Set a 2s timer that will set `longWaiting` to true. Used to show an
    // additional "cough" message on the loading screen
    longWaitingTimeout = setTimeout(() => {
      console.log('<Loading> - Long waiting');
      setLongWaiting(true);
    }, 2000);

    return clearLongWaiting;
  }, []);

  useEffect(() => {
    if (api) {
      clearLongWaiting();
    }
  }, [api]);

  return (
    <Background style={theme.withPadding}>
      <Text style={styles.text}>{renderText(longWaiting, gps, api)}</Text>
    </Background>
  );
}

function renderCough (index: number) {
  return (
    <Text key={index}>
      {i18n.t('loading_title_cough')}
      <Text style={styles.dots}>...</Text>
    </Text>
  );
}

function renderText (longWaiting: boolean, gps?: Location, api?: Api) {
  let coughs = 0; // Number of times to show "Cough..."
  if (gps) ++coughs;
  if (longWaiting) ++coughs;
  if (api) ++coughs;

  return (
    <Text>
      {i18n.t('loading_title_loading')}
      <Text style={styles.dots}>...</Text>
      {Array.from({ length: coughs }, (_, index) => index + 1).map(
        // Create array 1..N and rendering Cough...
        renderCough
      )}
    </Text>
  );
}

const styles = StyleSheet.create({
  dots: {
    color: theme.primaryColor
  },
  text: {
    ...theme.title,
    fontSize: 18,
    textAlign: 'center'
  }
});
