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

import React, { PureComponent } from 'react';
import { Picker } from 'react-native';

import { i18n } from '../../../localization';

export class Language extends PureComponent {
  handleValueChange = (itemValue) => {
    i18n.locale = itemValue;
  }

  render () {
    return (
      <Picker
        onValueChange={this.handleValueChange}
        selectedValue={i18n.locale}
        style={{ height: 50, width: 100 }}
      >
        <Picker.Item label="English (US)" value="en" />
        <Picker.Item label="Spanish (Spain(" value="es" />
      </Picker>
    );
  }
}
